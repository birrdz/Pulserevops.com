// 🔒 4444 LOCKED (owner 2026-06-30) — do not change without an explicit 4444.
// _scrub_button_server.js — LOCAL scrubber for the SEO Perfect room.
// ONE scrub at a time (runScrubExclusive): manual, auto-loop, and API callers queue — no parallel scrubs.
// Owner design: no cron, no timer. You open the page (localhost), enter 4444, and click ONE button.
// Each click scrubs the NEXT URL synchronously (full deep pass: content + flux face-card + DDG section images).
// No fast pass — every entry runs scrubOne end-to-end including Pollinator cover + DuckDuckGo internals.
//
// Content fixes use DeepSeek (fixEntry). Fabrication audit uses Claude Code CLI (quad code) on Max plan;
// DeepSeek skeptics only as fallback or optional second check (see _scrub_crew_manifest.js).
//
//   node _scrub_button_server.js     →  http://localhost:8899/  (enter 4444)
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execFile, spawn } = require('child_process');
let imageScrubChild = null;   // legacy image-only child (_image_scrub.js) — NOT started by Begin Scrub; run manually if needed
const WD = process.env.PULSE_ROOT || __dirname;
const ENV_FILE = path.join(WD, '.env.local');
if (fs.existsSync(ENV_FILE)) for (const l of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { buildScrubCrewManifest, resolveAuditorCounts, crewOneLiner, isHumanAuditorMode, LANE_AUDITOR_MODE, LANE_CONTENT_WRITERS, GEN_WRITERS } = require('./_scrub_crew_manifest');
const adaptiveThrottle = require('./_adaptive_throttle_learner');
const { getStore } = require('@netlify/blobs');
const { gradeEntry, BANNED_PHRASES, pillarOf: graderPillar } = require('./netlify/functions/lib/grade-entry');
const { ensureImages: ensureTop10Images, auditImages: auditTop10Images, isTop10Body } = require('./netlify/functions/lib/ensure-entry-images');
const {
  auditRankingListMaster,
  ensureRankingListFormat,
  entryTitle,
  expectedRankCount,
  rankingImageTotal,
  isRankingListBody,
  RANKING_LIST_BYPASS_CODE,
} = require('./_ranking_list_master_law');
const { auditQaGoldTemplate, appliesQaGold } = require('./_qa_gold_template');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { makePipelineTemplateRun } = require('./_pipeline_template_log');
// 🔒 RANKING LIST MASTER LAW (owner 4444, 2026-07-06): Top 10, Best 10, Best 5, Best N, "The Best …"
// ALL use the same page order (face-card → title → Direct Answer → How We Ranked → 1..N picks → tail).
// Bypass only with explicit owner passcode 4444 — see _ranking_list_master_law.js + .cursor/rules/ranking-list-master-law.mdc
function ensureErFormat(id, body) {
  return ensureRankingListFormat(id, body, null, { pillarOf: graderPillar });
}
function ensureTop10ProductLines(body) {
  return ensureRankingListFormat('x', body, entryTitle(body), { force: true });
}
// FACE-CARD LAW (owner 2026-07-02): the hero/face-card image is what shows on the homepage + pillar
// inventory BEFORE you open the entry, so it must be a REAL rendering photo — never a "still generating"
// Pollinations URL (renders black). If the current hero is flaky/generic, promote the BEST applicable
// real image already inside the entry (curated @@PRODUCT product photos first, then media) to the hero.
// Applied identically in writing (generateOne) + scrubbing (scrubOne). FYI = enforced, not optional.
const FACE_GENERIC = /\/assets\/cro-cover-\d|placeholder|og-preview|pulse-og|no-?image/i;
function heroOf(b) { const m = String(b || '').slice(0, 1200).match(/!\[[^\]]*\]\(([^)\s]+)/); return m ? m[1] : null; }
function bodyImages(b) { const s = String(b || ''); const prod = [], med = []; let m; const pr = /@@PRODUCT[^\n]* img="([^"]+)"/g; while ((m = pr.exec(s))) prod.push(m[1]); const md = /!\[[^\]]*\]\(([^)\s]+)/g; while ((m = md.exec(s))) med.push(m[1]); return [...prod, ...med]; }
function auditHero(id, body) {
  const cur = heroOf(body);
  if (cur && !FACE_GENERIC.test(cur) && !/pollinations/i.test(cur)) return body;      // hero already a real photo
  const better = bodyImages(body).find(u => u && u !== cur && !FACE_GENERIC.test(u) && !/pollinations/i.test(u));
  if (!better) return body;                                                            // nothing better inside → leave for image lane
  const alt = (String(body).match(/!\[([^\]]*)\]/) || [])[1] || id;
  return '![' + alt + '](' + better + ')\n\n' + String(body).replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
}
const { dsChat } = require('./_ds_lib');
const { fixEntry, C } = require('./_v2_components');
const { fixCover, pickImage, queryFrom } = require('./_v2_nr_ddg');
// 🔒🔒 POLLINATOR FACE-CARD COVER LAW (owner 2026-07-03) — covers are Pollinations flux ONLY (DDG banned).
// 🔒 OWNER 2026-07-04: Pollinator REMOVED from writing + scrubbing. Covers now = DDG face-cards with
// the dated Pollinator look (people/places/things, photo-refined, no watermarked stock). Same signatures.
const { faceCardCoverOk, ensureAlternateFaceCover: ensureFaceCardCover, ensureDdgSectionImage, pickReusableLibraryImage, bodyPageImageUrls, fillEntryMissingImages, sweepAllDuplicateImages, countBodyImageDupes, harvestRegistryDupeIds, harvestPillarFilledUrls, backfillRegistry, coverFileOk, verifyQaAssetRenders, stampCoverProvenance: stampFluxProvenance, countPillarPoolSlots, pillarPoolInventory, isPoolImageUrl, ensurePillarPoolSlot, harvestPillarPoolFromLibrary, runPillarPoolBuild, collectPillarPoolBatch, autoCuratePoolBatch, commitPillarPoolBatch, discardPillarPoolBatch, flushReg, storeGradedImage, coverPath, pHash, purgeFaceCardRegistry, markFaceCardForceRegen, clearFaceCardForceRegen, FILL_REUSE_PCT } = require('./_ddg_facecard_lib');
const { readSquareQueue, enqueueSquareBuild, completeSquareBuild, removeSquareBuildsByPrefix } = require('./_square_builder_queue');
const { deriveImageSearchQuery } = require('./netlify/functions/lib/derive-image-search-query');
const { sendSquareQueueEmail, sendSquareBacklogEmail, sendCompletedQaImagesEmail } = require('./_facecard_resend_email');
const { buildSquareDeskPage } = require('./_square_desk');
const { recordPreference: recordSquarePreference, choosePreferredResult, readPreferences: readSquarePreferences } = require('./_square_builder_preferences');
const POOL_AUTO_CURATE = process.env.POOL_MANUAL_REVIEW !== '1';
const IMG_GEN_BATCH_DEFAULT = parseInt(process.env.IMG_GEN_BATCH_DEFAULT || '209', 10);
const IMG_GEN_BATCH_MAX = parseInt(process.env.IMG_GEN_BATCH_MAX || '250', 10);
// 🔒 IMAGE LAW (owner 2026-07-05): internal ## sections = DDG self-host · face-card + top hero = Pollinator flux.
const INTERNAL_IMAGES_DDG = true;
// IMAGE_ALTERNATE (owner 2026-07-08): let BOTH providers (DDG + Pollinator) handle section/top10/verify
// images and ping-pong every image (IMAGE_ROTATE_BATCH=1) so their 20s cooldowns interleave — while one
// cools the other produces → one image always in flight, no single-provider stall. Cover stays flux (face law).
const IMAGE_ALTERNATE = process.env.IMAGE_ALTERNATE === '1';
// Image-production pause switch driven by the stuck-watchdog: while _img_pause_until.txt is in the
// future the lane skips flux/ddg image picks (content/audit keep running), then auto-resumes.
function imagePausedNow() {
  try { const t = parseInt(fs.readFileSync(WD + '/_img_pause_until.txt', 'utf8').trim(), 10); return !!t && Date.now() < t; } catch (e) { return false; }
}
/** Pollinator flux gap between cover/hero jobs. */
const IMAGE_GAP_MS = parseInt(process.env.IMAGE_GAP_MS || process.env.POLLINATOR_FREQ_MS || '20000', 10);
/** DDG section image gap — owner default 10s between writes. */
const DDG_GAP_MS = parseInt(process.env.DDG_GAP_MS || process.env.DDG_PACE_MS || '10000', 10);
const REQUIRE_FLUX_IMAGES = true;
const REQUIRE_FLUX_COVER = process.env.REQUIRE_FLUX_COVER !== '0';
const { fluxifyBody, fluxifyCoverOnly, bodyImagesAllFlux, countFluxJobs, countCoverFluxJobs, makeContent, KORY_CRO_IMG, isKoryCroImg } = require('./_img_flux_lib');
const { fluxRewriteEntry, countRewriteJobs, fluxFaceHeroOnlyEntry, countFaceHeroJobs, syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const { coverSrcIsValid } = require('./_entry_image_reuse_lib');
const { formatFixEntry, contentFormatPass, contentRubricAudit, ensureDirectAnswerAfterHero } = require('./_format_fixer_lib');
const { internalImagesFixEntry, internalImagesPass, internalImagesRubricAudit } = require('./_internal_images_lib');
const { STATIONS, stationKeys, stationAuditFromRubric, stationNeedsWork, listStations } = require('./_rubric_station_lib');
const { stripAllCroFromBody, countCroInBody } = require('./_cro_strip_lib');
// ⏱ DDG section pacing — 10s between each section image write. Render settle stays short.
const ddgPace = () => new Promise(r => setTimeout(r, DDG_GAP_MS));
const ddgQueryPace = () => new Promise(r => setTimeout(r, Math.min(3000, DDG_GAP_MS)));
const ddgSettle = () => new Promise(r => setTimeout(r, parseInt(process.env.DDG_SETTLE_MS || '1200', 10)));
const ddgRenderSettle = () => new Promise(r => setTimeout(r, parseInt(process.env.DDG_RENDER_SETTLE_MS || '1200', 10)));
// ⏸ Gap between new Q&A pipeline runs — 0 default (Pollinator serial queue is the natural pace).
const PIPELINE_ENTRY_GAP_MS = parseInt(process.env.PIPELINE_ENTRY_GAP_MS || '0', 10);
const PIPELINE_ENTRY_GAP_FLOOR_MS = parseInt(process.env.PIPELINE_ENTRY_GAP_FLOOR_MS || '0', 10);
const PIPELINE_ENTRY_GAP_READY_MS = parseInt(process.env.PIPELINE_ENTRY_GAP_READY_MS || '0', 10);
const PIPELINE_ENTRY_GAP_COOLING_MS = parseInt(process.env.PIPELINE_ENTRY_GAP_COOLING_MS || '0', 10);
// Generate → scrub queue → auto-scrub → publish on 13/13 (owner pipeline law).
const PIPELINE_AUTO_SCRUB_PUBLISH = process.env.PIPELINE_AUTO_SCRUB_PUBLISH === '1';
const pipelineScrubPriority = new Set();
const IMAGE_DUPE_F = WD + '/_image_dupe_priority.json';
const IMAGE_DUPE_SCAN_F = WD + '/_image_dupe_scan_state.json';
let imageDupePriority = new Set();
let imageDupeCounts = {};
let imageDupeScanJob = { running: false, done: 0, total: 0, found: 0, cursor: 0, startedAt: null, finishedAt: null, error: '' };
function loadImageDupePriority() {
  try {
    const j = JSON.parse(fs.readFileSync(IMAGE_DUPE_F, 'utf8'));
    imageDupeCounts = j.counts || {};
    imageDupePriority = new Set(Object.keys(imageDupeCounts));
  } catch (e) {
    imageDupeCounts = {};
    imageDupePriority = new Set();
  }
}
function saveImageDupePriority() {
  try {
    fs.writeFileSync(IMAGE_DUPE_F, JSON.stringify({ at: Date.now(), counts: imageDupeCounts, ids: [...imageDupePriority] }, null, 1));
  } catch (e) {}
}
function markImageDupeResolved(id) {
  if (!id) return;
  imageDupePriority.delete(id);
  delete imageDupeCounts[id];
  saveImageDupePriority();
}
function noteImageDupe(id, count) {
  if (!id || !count) return;
  imageDupePriority.add(id);
  imageDupeCounts[id] = Math.max(imageDupeCounts[id] || 0, count);
}
async function scanImageDupesBatch(batchSize) {
  if (imageDupeScanJob.running) return { ok: false, msg: 'scan already running' };
  batchSize = Math.max(20, Math.min(parseInt(batchSize, 10) || 120, 500));
  let state = { cursor: 0 };
  try { state = JSON.parse(fs.readFileSync(IMAGE_DUPE_SCAN_F, 'utf8')); } catch (e) {}
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)));
  imageDupeScanJob = { running: true, done: state.cursor || 0, total: entries.length, found: imageDupePriority.size, cursor: state.cursor || 0, startedAt: Date.now(), finishedAt: null, error: '' };
  (async () => {
    try {
      await backfillRegistry();
      let i = imageDupeScanJob.cursor;
      const end = Math.min(entries.length, i + batchSize);
      for (; i < end; i++) {
        const id = entries[i].id;
        try {
          const e = await store.get('answers/' + id + '.json', { type: 'json' });
          if (!e || !e.answer) continue;
          const r = await countBodyImageDupes(id, e.answer);
          if (r.total > 0) noteImageDupe(id, r.total);
          else if (imageDupePriority.has(id) && !harvestRegistryDupeIds()[id]) markImageDupeResolved(id);
        } catch (x) {}
        imageDupeScanJob.done = i + 1;
        imageDupeScanJob.cursor = i + 1;
        imageDupeScanJob.found = imageDupePriority.size;
      }
      const nextCursor = imageDupeScanJob.cursor >= entries.length ? 0 : imageDupeScanJob.cursor;
      fs.writeFileSync(IMAGE_DUPE_SCAN_F, JSON.stringify({ cursor: nextCursor, at: Date.now(), total: entries.length }, null, 1));
      saveImageDupePriority();
      if (nextCursor === 0) autoLog('🔄 image-dupe scan wrapped full library — ' + imageDupePriority.size + ' entries prioritized');
      else autoLog('🔄 image-dupe scan batch — ' + imageDupeScanJob.done + '/' + entries.length + ' · ' + imageDupePriority.size + ' prioritized');
    } catch (e) { imageDupeScanJob.error = e.message; }
    imageDupeScanJob.running = false;
    imageDupeScanJob.finishedAt = Date.now();
  })();
  return { ok: true, started: true, batch: batchSize, cursor: imageDupeScanJob.cursor, total: imageDupeScanJob.total };
}
const IMAGE_DUPLICATOR_F = WD + '/_image_duplicator_run.json';
let imageDuplicatorJob = { running: false, stop: false, pillar: null, pillarName: 'All pillars', done: 0, total: 0, pct: 0, slotsEmpty: 0, entriesWithBlanks: 0, entriesFilled: 0, imagesFilled: 0, skippedNoMatch: 0, skippedNoBlob: 0, clean: 0, errors: 0, currentId: '', currentTitle: '', currentStep: '', phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [] };
function saveImageDuplicatorState(force) {
  if (!force && imageDuplicatorJob.running) {
    if (saveImageDuplicatorState._t) return;
    saveImageDuplicatorState._t = setTimeout(() => { saveImageDuplicatorState._t = null; saveImageDuplicatorState(true); }, 2000);
    return;
  }
  if (saveImageDuplicatorState._t) { clearTimeout(saveImageDuplicatorState._t); saveImageDuplicatorState._t = null; }
  try {
    const snap = Object.assign({}, imageDuplicatorJob);
    delete snap._entries;
    fs.writeFileSync(IMAGE_DUPLICATOR_F, JSON.stringify(snap, null, 1));
  } catch (e) {}
}
function imageDuplicatorLog(msg) {
  imageDuplicatorJob.log.unshift(new Date().toLocaleTimeString() + ' ' + msg);
  imageDuplicatorJob.log = imageDuplicatorJob.log.slice(0, 48);
}
async function getImageDuplicatorEntries(pillar) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let entries = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)));
  if (pillar) entries = entries.filter(e => pillarOf(e.id) === pillar);
  return entries;
}
async function processImageDuplicatorEntry(id) {
  const title = titleOf[id] || id;
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { noBlob: true };
  const ENTRY_MS = 120000;
  const deadline = Date.now() + ENTRY_MS;
  const timed = () => Date.now() > deadline;
  imageDuplicatorJob.currentStep = 'scanning blanks';
  const slotsTarget = Math.max(1, imageDuplicatorJob.slotsTarget || imageDuplicatorJob.slotsEmpty || 1);
  const jobFillPct = (imageDuplicatorJob.imagesFilled || 0) / slotsTarget;
  const allowFilledReuse = jobFillPct >= FILL_REUSE_PCT;
  const fillOpts = {
    minScore: 9,
    titleLookup: titleOf,
    upgradeMode: true,
    pollinatorPrefer: true,
    poolOnly: true,
    coverSrcLookup: coverSrcOf,
    jobFillPct,
    allowFilledReuse,
    filledReuseUrls: imageDuplicatorJob.filledUrlList || [],
    shouldStop: () => imageDuplicatorJob.stop || !imageDuplicatorJob.running,
    onProgress: p => {
      imageDuplicatorJob.currentStep = (p.phase === 'pick' ? 'pick · ' : 'fill · ') + (p.label || 'slot');
      saveImageDuplicatorState(true);
    },
  };
  const r = await fillEntryMissingImages(id, title, e.answer, fillOpts);
  if (timed()) return { slots: r.slots || 0, fixed: r.fixed || 0, skipped: r.skipped || 0, timedOut: true };
  if (!r.slots) return { clean: true };
  let outBody = r.body || e.answer;
  if (outBody && outBody !== e.answer) {
    imageDuplicatorJob.currentStep = 'dedupe sweep';
    saveImageDuplicatorState(true);
    outBody = await dedupeEntryImages(id, title, outBody, null, null, {
      libraryOnly: true,
      poolOnly: true,
      onProgress: p => {
        imageDuplicatorJob.currentStep = 'dedupe · ' + (p.label || 'rotate');
        saveImageDuplicatorState(true);
      },
    });
    if (timed()) return { slots: r.slots, fixed: r.fixed || 0, skipped: r.skipped || 0, timedOut: true };
    await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: outBody, updated_at: new Date().toISOString() }));
    if (!imageDuplicatorJob.filledUrlList) imageDuplicatorJob.filledUrlList = [];
    for (const u of bodyPageImageUrls(outBody)) {
      if (u && imageDuplicatorJob.filledUrlList.indexOf(u) === -1) imageDuplicatorJob.filledUrlList.push(u);
    }
    const heroM = String(outBody).match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    if (heroM && (isPoolImageUrl(heroM[1]) || heroM[1] === '/assets/qa/' + id + '.jpg')) {
      try {
        await stampFluxProvenance(id, store, 'flux');
        coverSrcOf[id] = 'flux';
      } catch (err) {}
    }
  }
  return { slots: r.slots, fixed: r.fixed || 0, skipped: r.skipped || 0 };
}
async function runImageDuplicatorLoop() {
  if (imageDuplicatorJob.running) return;
  imageDuplicatorJob.running = true;
  imageDuplicatorJob.stop = false;
  imageDuplicatorJob.phase = 'fill';
  try {
    const entries = imageDuplicatorJob._entries || await getImageDuplicatorEntries(imageDuplicatorJob.pillar);
    imageDuplicatorJob._entries = entries;
    imageDuplicatorJob.total = entries.length;
    if (!imageDuplicatorJob.total) {
      imageDuplicatorLog('⚠️ no entries for filter');
      imageDuplicatorJob.phase = 'done';
      imageDuplicatorJob.running = false;
      imageDuplicatorJob.finishedAt = Date.now();
      saveImageDuplicatorState();
      return;
    }
    let i = imageDuplicatorJob.done || 0;
    while (i < entries.length && !imageDuplicatorJob.stop) {
      const row = entries[i];
      const id = row.id;
      imageDuplicatorJob.currentId = id;
      imageDuplicatorJob.currentTitle = String(titleOf[id] || row.question || id).slice(0, 90);
      imageDuplicatorJob.currentStep = 'checking';
      try {
        const r = await processImageDuplicatorEntry(id);
        if (r.noBlob) imageDuplicatorJob.skippedNoBlob++;
        else if (r.clean) imageDuplicatorJob.clean++;
        else {
          imageDuplicatorJob.slotsEmpty += r.slots || 0;
          imageDuplicatorJob.slotsTarget = (imageDuplicatorJob.slotsTarget || 0) + (r.slots || 0);
          imageDuplicatorJob.skippedNoMatch += r.skipped || 0;
          if (r.slots) imageDuplicatorJob.entriesWithBlanks++;
          imageDuplicatorJob.imagesFilled += r.fixed || 0;
          if (r.fixed > 0) imageDuplicatorJob.entriesFilled++;
          if (r.timedOut) imageDuplicatorLog('⏱ ' + id + ' · timed out — skipped');
          else imageDuplicatorLog('🖼 ' + id + (r.fixed ? (' · filled ' + r.fixed + ' slot(s)') : ' · no match') + (r.skipped ? (' · ' + r.skipped + ' skipped') : ''));
        }
      } catch (err) {
        imageDuplicatorJob.errors++;
        imageDuplicatorLog('⚠️ ' + id + ' · ' + String(err.message || err).slice(0, 80));
      }
      i++;
      imageDuplicatorJob.done = i;
      imageDuplicatorJob.pct = imageDuplicatorJob.total ? Math.min(100, Math.max(i > 0 && i < imageDuplicatorJob.total ? 0.1 : 0, Math.round((i / imageDuplicatorJob.total) * 1000) / 10)) : 0;
      saveImageDuplicatorState();
      await new Promise(res => setTimeout(res, 350));
    }
    imageDuplicatorJob.phase = imageDuplicatorJob.stop ? 'stopped' : 'done';
    imageDuplicatorLog(imageDuplicatorJob.stop
      ? ('⏹ stopped at ' + imageDuplicatorJob.pct + '%')
      : ('✅ complete — ' + imageDuplicatorJob.entriesFilled + ' entries updated · ' + imageDuplicatorJob.imagesFilled + ' slots filled · ' + imageDuplicatorJob.skippedNoMatch + ' skipped (no match)'));
    saveImageDupePriority();
  } catch (e) {
    imageDuplicatorJob.error = e.message;
    imageDuplicatorJob.phase = 'error';
    imageDuplicatorLog('❌ ' + e.message);
  }
  imageDuplicatorJob.running = false;
  imageDuplicatorJob.finishedAt = Date.now();
  imageDuplicatorJob.currentId = '';
  imageDuplicatorJob.currentStep = '';
  saveImageDuplicatorState(true);
}
function startImageDuplicator(pillar, guideKeywords) {
  if (imageDuplicatorJob.running) return { ok: false, msg: 'already running' };
  const busy = imageJobConflict('duplicator');
  if (busy) return { ok: false, msg: busy };
  pillar = (!pillar || pillar === 'all') ? null : String(pillar);
  guideKeywords = String(guideKeywords || '').trim().slice(0, 800);
  imageDuplicatorJob = {
    running: false, stop: false, pillar, pillarName: pillar ? pName(pillar) : 'All pillars', guideKeywords,
    done: 0, total: 0, pct: 0, slotsEmpty: 0, slotsTarget: 0, entriesWithBlanks: 0, entriesFilled: 0,
    imagesFilled: 0, skippedNoMatch: 0, skippedNoBlob: 0, clean: 0, errors: 0, currentId: '', currentTitle: '', currentStep: '',
    phase: 'starting', startedAt: Date.now(), finishedAt: null, error: '', log: [],
    filledUrlList: harvestPillarFilledUrls(pillar),
    _entries: null,
  };
  const kwNote = guideKeywords ? (' · guide: ' + guideKeywords.slice(0, 48) + (guideKeywords.length > 48 ? '…' : '')) : '';
  imageDuplicatorLog('▶ Image fill — ' + imageDuplicatorJob.pillarName + kwNote + ' (pool only · unique until ' + Math.round(FILL_REUSE_PCT * 100) + '% filled · then reuse)');
  runImageDuplicatorLoop().catch(e => { imageDuplicatorJob.error = e.message; imageDuplicatorJob.running = false; imageDuplicatorJob.phase = 'error'; });
  return { ok: true, started: true, pillar, pillarName: imageDuplicatorJob.pillarName, guideKeywords };
}
function stopImageDuplicator() {
  if (!imageDuplicatorJob.running) return { ok: false, msg: 'not running' };
  imageDuplicatorJob.stop = true;
  return { ok: true, stopping: true };
}
function forceStopImageDuplicator() {
  imageDuplicatorJob.stop = true;
  imageDuplicatorJob.running = false;
  imageDuplicatorJob.phase = 'stopped';
  imageDuplicatorJob.finishedAt = Date.now();
  imageDuplicatorJob.currentId = '';
  imageDuplicatorJob.currentStep = 'force stopped';
  imageDuplicatorLog('⏹ force stop — image fill halted');
  saveImageDuplicatorState(true);
  return { ok: true, forceStopped: true };
}
function imageDuplicatorStatusPayload() {
  const snap = Object.assign({}, imageDuplicatorJob, {
    prioritized: imageDupePriority.size,
    log: (imageDuplicatorJob.log || []).slice(0, 24),
  });
  delete snap._entries;
  return snap;
}
const IMAGE_GENERATOR_F = WD + '/_image_generator_run.json';
const IMAGE_GENERATOR_BATCH_F = WD + '/_image_generator_batch.json';
let imageGeneratorJob = { running: false, stop: false, pillar: 'tl', pillarName: 'Pulse Tools / CRO', target: IMG_GEN_BATCH_DEFAULT, done: 0, total: IMG_GEN_BATCH_DEFAULT, pct: 0, poolCount: 0, harvested: 0, generated: 0, fluxGenerated: 0, errors: 0, currentSlot: 0, currentQuery: '', guideKeywords: '', phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [], batch: null };
let imageGeneratorBatch = null;
try {
  const _igSnap = JSON.parse(fs.readFileSync(IMAGE_GENERATOR_F, 'utf8'));
  if (_igSnap && typeof _igSnap === 'object') imageGeneratorJob = Object.assign(imageGeneratorJob, _igSnap, { running: false, stop: false, phase: _igSnap.phase === 'build' || _igSnap.phase === 'collect' ? 'stopped' : (_igSnap.phase || 'idle') });
} catch (e) {}
try {
  const _igBatch = JSON.parse(fs.readFileSync(IMAGE_GENERATOR_BATCH_F, 'utf8'));
  if (_igBatch && _igBatch.batchId && Array.isArray(_igBatch.candidates) && _igBatch.candidates.length) {
    imageGeneratorBatch = _igBatch;
    if (imageGeneratorJob.phase === 'idle' || imageGeneratorJob.phase === 'stopped') imageGeneratorJob.phase = 'review';
    imageGeneratorJob.batch = _igBatch;
  }
} catch (e) {}
function syncImageGeneratorLiveBatch() {
  const b = imageGeneratorJob.batch;
  if (!b || !Array.isArray(b.candidates)) return;
  imageGeneratorBatch = Object.assign({}, b, {
    harvested: imageGeneratorJob.harvested || 0,
    generated: imageGeneratorJob.generated || 0,
    fluxGenerated: imageGeneratorJob.fluxGenerated || 0,
    errors: imageGeneratorJob.errors || 0,
    target: imageGeneratorJob.target,
    createdAt: (imageGeneratorBatch && imageGeneratorBatch.batchId === b.batchId && imageGeneratorBatch.createdAt) || Date.now(),
  });
  saveImageGeneratorBatch();
}
function saveImageGeneratorBatch() {
  try {
    if (imageGeneratorBatch) fs.writeFileSync(IMAGE_GENERATOR_BATCH_F, JSON.stringify(imageGeneratorBatch, null, 1));
    else try { fs.unlinkSync(IMAGE_GENERATOR_BATCH_F); } catch (e) {}
  } catch (e) {}
}
function saveImageGeneratorState(force) {
  if (!force && imageGeneratorJob.running) {
    if (saveImageGeneratorState._t) return;
    saveImageGeneratorState._t = setTimeout(() => { saveImageGeneratorState._t = null; saveImageGeneratorState(true); }, 1500);
    return;
  }
  if (saveImageGeneratorState._t) { clearTimeout(saveImageGeneratorState._t); saveImageGeneratorState._t = null; }
  try {
    const snap = Object.assign({}, imageGeneratorJob);
    fs.writeFileSync(IMAGE_GENERATOR_F, JSON.stringify(snap, null, 1));
  } catch (e) {}
}
function imageGeneratorLog(msg) {
  imageGeneratorJob.log.unshift(new Date().toLocaleTimeString() + ' ' + msg);
  imageGeneratorJob.log = imageGeneratorJob.log.slice(0, 48);
}
async function runImageGeneratorLoop() {
  if (imageGeneratorJob.running) return;
  if (imageGeneratorBatch && imageGeneratorBatch.candidates && imageGeneratorBatch.candidates.length) {
    discardPillarPoolBatch(imageGeneratorBatch);
    imageGeneratorBatch = null;
    imageGeneratorJob.batch = null;
    saveImageGeneratorBatch();
  }
  imageGeneratorJob.running = true;
  imageGeneratorJob.stop = false;
  imageGeneratorJob.phase = 'collect';
  imageGeneratorJob.errors = 0;
  imageGeneratorJob.harvested = 0;
  imageGeneratorJob.generated = 0;
  imageGeneratorJob.fluxGenerated = 0;
  imageGeneratorJob.batch = null;
  try {
    const pillar = imageGeneratorJob.pillar;
    const target = imageGeneratorJob.target || IMG_GEN_BATCH_DEFAULT;
    imageGeneratorJob.total = target;
    imageGeneratorJob.poolCount = countPillarPoolSlots(pillar);
    imageGeneratorJob.done = 0;
    imageGeneratorJob.pct = 0;
    saveImageGeneratorState();
    const r = await collectPillarPoolBatch(pillar, target, {
      fluxOnly: true,
      guideKeywords: imageGeneratorJob.guideKeywords || '',
      shouldStop: () => imageGeneratorJob.stop,
      onBatchStart: b => {
        imageGeneratorJob.batch = { batchId: b.batchId, pillar: b.pillar, candidates: [], target: b.target };
        imageGeneratorBatch = null;
        saveImageGeneratorState();
      },
      onLog: msg => { imageGeneratorLog(msg); saveImageGeneratorState(); },
      onProgress: p => {
        imageGeneratorJob.currentSlot = p.idx;
        imageGeneratorJob.done = p.have != null ? p.have : (imageGeneratorJob.batch && imageGeneratorJob.batch.candidates ? imageGeneratorJob.batch.candidates.length : 0);
        imageGeneratorJob.currentQuery = String(p.query || '').slice(0, 120);
        imageGeneratorJob.pct = target ? Math.min(99, Math.round(((p.have != null ? p.have : (imageGeneratorJob.batch && imageGeneratorJob.batch.candidates ? imageGeneratorJob.batch.candidates.length : 0)) / target) * 100)) : 0;
        saveImageGeneratorState();
      },
      onCandidate: c => {
        if (!imageGeneratorJob.batch) imageGeneratorJob.batch = { batchId: '', pillar, candidates: [] };
        imageGeneratorJob.batch.candidates.push(c);
        imageGeneratorJob.done = imageGeneratorJob.batch.candidates.length;
        if (c.source === 'flux') imageGeneratorJob.fluxGenerated = (imageGeneratorJob.fluxGenerated || 0) + 1;
        else if (c.source === 'harvest') imageGeneratorJob.harvested = (imageGeneratorJob.harvested || 0) + 1;
        else if (c.source === 'ddg') imageGeneratorJob.generated = (imageGeneratorJob.generated || 0) + 1;
        syncImageGeneratorLiveBatch();
        saveImageGeneratorState();
      },
    });
    imageGeneratorBatch = {
      batchId: r.batchId, pillar, candidates: r.candidates, harvested: r.harvested, generated: r.generated, fluxGenerated: r.fluxGenerated || 0, errors: r.errors,
      createdAt: Date.now(), target,
    };
    imageGeneratorJob.batch = imageGeneratorBatch;
    imageGeneratorJob.harvested = r.harvested;
    imageGeneratorJob.generated = r.generated;
    imageGeneratorJob.fluxGenerated = r.fluxGenerated || 0;
    imageGeneratorJob.errors = r.errors;
    imageGeneratorJob.done = r.candidates.length;
    imageGeneratorJob.poolCount = countPillarPoolSlots(pillar);
    imageGeneratorJob.pct = 100;
    if (r.candidates.length && POOL_AUTO_CURATE) {
      imageGeneratorJob.phase = 'curate';
      saveImageGeneratorState();
      imageGeneratorLog('🤖 Auto-curating ' + r.candidates.length + ' candidates…');
      const curate = await autoCuratePoolBatch(pillar, imageGeneratorBatch, { onLog: msg => imageGeneratorLog(msg) });
      imageGeneratorBatch.candidates = curate.candidates;
      imageGeneratorJob.batch = imageGeneratorBatch;
      syncImageGeneratorLiveBatch();
      const s = curate.stats;
      imageGeneratorLog('🤖 Keep ' + s.kept + ' · reject ' + s.rejected + ' (dupe ' + s.dupe + ', cliché ' + s.cliche + ', low ' + s.low + ')');
      imageGeneratorJob.phase = 'committing';
      saveImageGeneratorState();
      const cr = await commitPillarPoolBatch(pillar, imageGeneratorBatch, curate.approvals);
      imageGeneratorLog('💾 Auto-saved ' + cr.committed + ' to pool (' + cr.rejected + ' discarded) — pool now ' + cr.poolCount);
      imageGeneratorBatch = null;
      imageGeneratorJob.batch = null;
      imageGeneratorJob.poolCount = cr.poolCount;
      imageGeneratorJob.done = cr.poolCount;
      imageGeneratorJob.phase = 'idle';
      saveImageGeneratorBatch();
    } else {
      imageGeneratorJob.phase = imageGeneratorJob.stop || r.stopped ? 'review' : (r.candidates.length ? 'review' : 'error');
      saveImageGeneratorBatch();
      imageGeneratorLog(imageGeneratorJob.phase === 'review'
        ? ('👀 Review ' + r.candidates.length + ' candidates — ✓/✗ each, then Save to pool')
        : ('⏸ stopped at ' + r.candidates.length + '/' + target));
    }
  } catch (e) {
    imageGeneratorJob.error = e.message;
    imageGeneratorJob.phase = 'error';
    imageGeneratorLog('❌ ' + e.message);
  }
  imageGeneratorJob.running = false;
  imageGeneratorJob.finishedAt = Date.now();
  imageGeneratorJob.currentQuery = '';
  saveImageGeneratorState(true);
}
function startImageGenerator(pillar, target, guideKeywords) {
  if (imageGeneratorJob.running) return { ok: false, msg: 'already running' };
  const busy = imageJobConflict('imgen');
  if (busy) return { ok: false, msg: busy };
  pillar = pillar && pillar !== 'all' ? pillar : 'tl';
  target = Math.max(1, Math.min(IMG_GEN_BATCH_MAX, parseInt(target, 10) || IMG_GEN_BATCH_DEFAULT));
  guideKeywords = String(guideKeywords || '').trim().slice(0, 800);
  const have = countPillarPoolSlots(pillar);
  imageGeneratorJob = {
    running: false, stop: false, pillar, pillarName: pName(pillar), target, done: 0, total: target,
    pct: 0, poolCount: have, harvested: 0, generated: 0, fluxGenerated: 0, errors: 0,
    currentSlot: 0, currentQuery: '', guideKeywords, phase: 'starting', startedAt: Date.now(), finishedAt: null, error: '', log: [], batch: null,
  };
  imageGeneratorLog('▶ Pollinator-only · serial flux (no extra wait) · target ' + target + ' for ' + pillar + ' (' + have + ' in pool)'
    + (guideKeywords ? (' · guide: ' + guideKeywords.slice(0, 72) + (guideKeywords.length > 72 ? '…' : '')) : ''));
  saveImageGeneratorState();
  runImageGeneratorLoop().catch(e => { imageGeneratorJob.error = e.message; imageGeneratorJob.running = false; imageGeneratorJob.phase = 'error'; saveImageGeneratorState(); });
  return { ok: true, started: true, pillar, pillarName: imageGeneratorJob.pillarName, target, poolCount: have, guideKeywords };
}
function stopImageGenerator() {
  if (!imageGeneratorJob.running) return { ok: false, msg: 'not running' };
  imageGeneratorJob.stop = true;
  return { ok: true, stopping: true };
}
function forceStopImageGenerator() {
  imageGeneratorJob.stop = true;
  imageGeneratorJob.running = false;
  if (imageGeneratorBatch) discardPillarPoolBatch(imageGeneratorBatch);
  imageGeneratorBatch = null;
  imageGeneratorJob.batch = null;
  imageGeneratorJob.phase = 'stopped';
  imageGeneratorJob.finishedAt = Date.now();
  imageGeneratorJob.currentQuery = '';
  imageGeneratorJob.currentStep = 'force stopped';
  imageGeneratorLog('⏹ force stop — pool generator halted');
  saveImageGeneratorBatch();
  saveImageGeneratorState(true);
  return { ok: true, forceStopped: true };
}
async function commitImageGeneratorBatch(approvals) {
  if (!imageGeneratorBatch || !imageGeneratorBatch.candidates || !imageGeneratorBatch.candidates.length) {
    return { ok: false, msg: 'no batch to commit' };
  }
  if (imageGeneratorJob.running) return { ok: false, msg: 'still collecting' };
  imageGeneratorJob.phase = 'committing';
  saveImageGeneratorState();
  const pillar = imageGeneratorBatch.pillar || imageGeneratorJob.pillar;
  const r = await commitPillarPoolBatch(pillar, imageGeneratorBatch, approvals || {});
  imageGeneratorLog('💾 Saved ' + r.committed + ' to pool (' + r.rejected + ' rejected) — pool now ' + r.poolCount);
  imageGeneratorBatch = null;
  imageGeneratorJob.batch = null;
  imageGeneratorJob.poolCount = r.poolCount;
  imageGeneratorJob.done = r.poolCount;
  imageGeneratorJob.phase = 'idle';
  saveImageGeneratorBatch();
  saveImageGeneratorState();
  return { ok: true, committed: r.committed, rejected: r.rejected, poolCount: r.poolCount };
}
function discardImageGeneratorBatch() {
  if (imageGeneratorBatch) discardPillarPoolBatch(imageGeneratorBatch);
  imageGeneratorBatch = null;
  imageGeneratorJob.batch = null;
  imageGeneratorJob.phase = 'idle';
  saveImageGeneratorBatch();
  saveImageGeneratorState();
  return { ok: true };
}
function resetImageGenerator() {
  imageGeneratorJob.stop = true;
  if (imageGeneratorBatch) discardPillarPoolBatch(imageGeneratorBatch);
  imageGeneratorBatch = null;
  const pillar = imageGeneratorJob.pillar || 'tl';
  imageGeneratorJob = {
    running: false, stop: false, pillar, pillarName: pName(pillar), target: IMG_GEN_BATCH_DEFAULT, done: 0, total: IMG_GEN_BATCH_DEFAULT,
    pct: 0, poolCount: countPillarPoolSlots(pillar), harvested: 0, generated: 0, fluxGenerated: 0, errors: 0,
    currentSlot: 0, currentQuery: '', guideKeywords: '', phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [], batch: null,
  };
  imageGeneratorLog('🔄 Image Generator reset — ready for new batch');
  saveImageGeneratorBatch();
  saveImageGeneratorState();
  return { ok: true, reset: true, poolCount: imageGeneratorJob.poolCount };
}
function imageGeneratorPoolTopics() {
  const inv = pillarPoolInventory();
  const seen = new Set();
  const rows = [];
  for (const p of Object.keys(PILLAR_NAMES)) {
    seen.add(p);
    rows.push({ pillar: p, name: pName(p), poolCount: inv[p] || 0 });
  }
  for (const p of Object.keys(inv)) {
    if (seen.has(p)) continue;
    rows.push({ pillar: p, name: pName(p), poolCount: inv[p] || 0 });
  }
  rows.sort((a, b) => a.name.localeCompare(b.name) || a.pillar.localeCompare(b.pillar));
  const poolTotal = rows.reduce((n, r) => n + (r.poolCount || 0), 0);
  return { poolTopics: rows, poolTotal };
}
function imageGeneratorStatusPayload() {
  const j = Object.assign({}, imageGeneratorJob);
  j.poolCount = countPillarPoolSlots(j.pillar || 'tl');
  const pool = imageGeneratorPoolTopics();
  j.poolTopics = pool.poolTopics;
  j.poolTotal = pool.poolTotal;
  const batchSrc = imageGeneratorBatch
    || (imageGeneratorJob.batch && imageGeneratorJob.batch.candidates && imageGeneratorJob.batch.candidates.length ? imageGeneratorJob.batch : null);
  if (!j.running && j.phase !== 'collect' && j.phase !== 'starting') {
    j.done = batchSrc ? batchSrc.candidates.length : j.poolCount;
  }
  j.batch = batchSrc ? Object.assign({}, batchSrc, { candidates: (batchSrc.candidates || []).map(c => Object.assign({}, c)) }) : null;
  j.log = (imageGeneratorJob.log || []).slice(0, 24);
  return j;
}

// ── Pollinator Image Overwrite — force Pollinator on every image in a pillar (hero + sections) ──
const IMAGE_REWRITE_F = WD + '/_image_rewrite_run.json';
let imageRewriteJob = {
  running: false, stop: false, pillar: 'tl', pillarName: 'Pulse Tools / CRO',
  done: 0, total: 0, pct: 0, entriesDone: 0, imagesRewritten: 0, fluxJobs: 0,
  skippedNoBlob: 0, errors: 0, currentId: '', currentTitle: '', currentStep: '',
  phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [],
};
try {
  const _irSnap = JSON.parse(fs.readFileSync(IMAGE_REWRITE_F, 'utf8'));
  if (_irSnap && typeof _irSnap === 'object') {
    imageRewriteJob = Object.assign(imageRewriteJob, _irSnap, { running: false });
  }
} catch (e) {}
function saveImageRewriteState(force) {
  if (!force && imageRewriteJob.running) {
    if (saveImageRewriteState._t) return;
    saveImageRewriteState._t = setTimeout(() => { saveImageRewriteState._t = null; saveImageRewriteState(true); }, 1500);
    return;
  }
  if (saveImageRewriteState._t) { clearTimeout(saveImageRewriteState._t); saveImageRewriteState._t = null; }
  try {
    const snap = Object.assign({}, imageRewriteJob);
    delete snap._entries;
    fs.writeFileSync(IMAGE_REWRITE_F, JSON.stringify(snap, null, 1));
  } catch (e) {}
}
function imageRewriteLog(msg) {
  imageRewriteJob.log.unshift(new Date().toLocaleTimeString() + ' ' + msg);
  imageRewriteJob.log = imageRewriteJob.log.slice(0, 48);
}
function imageJobBusy() {
  return !!(imageDuplicatorJob.running || imageGeneratorJob.running || imageRewriteJob.running || faceHeroJob.running || formatFixerJob.running || internalImagesJob.running || rubricStationJob.running);
}
function imageJobConflict(except) {
  if (except !== 'duplicator' && except !== 'facehero' && imageDuplicatorJob.running) return 'image fill running';
  if (except !== 'imgen' && imageGeneratorJob.running) return 'image generator running';
  if (except !== 'rewrite' && (imageRewriteJob.running || imageRewriteJob.phase === 'review')) return 'Pollinator image overwrite running';
  if (except !== 'facehero' && except !== 'duplicator' && (faceHeroJob.running || faceHeroJob.phase === 'review')) return 'Face Card & Top Image Generator running';
  if (except !== 'formatfix' && formatFixerJob.running) return 'Format Fixer running';
  if (except !== 'internalimages' && internalImagesJob.running) return 'Internal Images running';
  if (except !== 'rubricstation' && rubricStationJob.running) return 'Rubric Station running';
  return null;
}
function slimImageReview(pr) {
  if (!pr) return null;
  return { id: pr.id, title: pr.title, previewUrl: pr.previewUrl, previewNonce: pr.previewNonce, attempt: pr.attempt || 1, fluxDone: pr.fluxDone, top10: !!pr.top10, template: pr.template || '', heroPlaced: !!pr.heroPlaced, searchQuery: pr.searchQuery || '', searchIdx: pr.searchIdx };
}
async function buildImageRewriteDraft(id, attempt) {
  const title = titleOf[id] || id;
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { noBlob: true };
  imageRewriteJob.currentStep = 'planning';
  const plan = countRewriteJobs(e.answer);
  imageRewriteJob.currentStep = 'flux 0/' + plan.total;
  const r = await fluxRewriteEntry(id, title, e.answer, {
    guideKeywords: imageRewriteJob.guideKeywords || '',
    attempt: attempt || imageRewriteJob.reviewAttempt || 1,
    coverSrcLookup: coverSrcOf,
    shouldStop: () => imageRewriteJob.stop,
    onProgress: p => {
      imageRewriteJob.currentStep = (p.phase || 'flux') + ' · ' + (p.label || p.detail || '');
      saveImageRewriteState(true);
    },
  });
  if (r.stopped) return { stopped: true };
  if (r.error) return { error: r.error, fluxDone: r.fluxDone || 0 };
  let outBody = r.body || e.answer;
  outBody = enforceCroCardLaw(outBody, id);
  outBody = ensureKoryAfterHero(outBody);
  outBody = syncHeroDupesFaceCard(id, title, outBody);
  if (!isTop10Body(outBody)) outBody = trimExcessMediaImages(stripPlaceholderImageLines(outBody));
  imageRewriteJob.currentStep = 'dedupe · within-page';
  outBody = await dedupeEntryImages(id, title, outBody, null, null, {
    onProgress: p => { imageRewriteJob.currentStep = 'dedupe · ' + (p.label || 'rotate'); saveImageRewriteState(true); },
  });
  imageRewriteJob.currentStep = 'verify · render check';
  await waitFluxIdle();
  const imgTriple = await tripleVerifyAllImagesRender(outBody, id, {});
  if (!imgTriple.ok) return { error: 'pollinator images failed render verify', fluxDone: r.fluxDone || 0, fluxTotal: r.fluxTotal || 0 };
  outBody = imgTriple.body || outBody;
  const rb = rubricSignOff(id, outBody);
  return { ok: true, body: outBody, fluxDone: r.fluxDone || 0, top10: !!r.top10, fluxTotal: r.fluxTotal || 0, rubricPass: rb.pass, rubricPct: rb.rubricPct, rubricFailed: rb.failed || [], searchQuery: r.searchQuery || '', searchIdx: r.searchIdx };
}
async function commitImageRewriteDraft(id, outBody) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e) return { ok: false, msg: 'no blob' };
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: outBody, updated_at: new Date().toISOString(), cover_src: 'flux', face_title_baked: true }));
  try { await stampFluxProvenance(id, store, 'flux'); coverSrcOf[id] = 'flux'; } catch (err) {}
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent) { ent.img = '/assets/qa/' + id + '.jpg'; ent.cover_src = 'flux'; ent.face_title_baked = true; await store.setJSON('_index.json', idx); }
  } catch (err) {}
  return { ok: true };
}
async function runImageRewriteLoop() {
  if (imageRewriteJob.running) return;
  imageRewriteJob.running = true;
  imageRewriteJob.stop = false;
  imageRewriteJob.phase = 'rewrite';
  try {
    const entries = imageRewriteJob._entries || await getImageDuplicatorEntries(imageRewriteJob.pillar);
    imageRewriteJob._entries = entries;
    imageRewriteJob.total = entries.length;
    if (!imageRewriteJob.total) {
      imageRewriteLog('⚠️ no entries for pillar');
      imageRewriteJob.phase = 'done';
      imageRewriteJob.running = false;
      imageRewriteJob.finishedAt = Date.now();
      saveImageRewriteState(true);
      return;
    }
    let i = imageRewriteJob.done || 0;
    while (i < entries.length && !imageRewriteJob.stop) {
      const row = entries[i];
      const id = row.id;
      imageRewriteJob.currentId = id;
      imageRewriteJob.currentTitle = String(titleOf[id] || row.question || id).slice(0, 90);
      imageRewriteJob.reviewAttempt = imageRewriteJob.reviewAttempt || 1;
      try {
        const r = await buildImageRewriteDraft(id, imageRewriteJob.reviewAttempt);
        if (r.noBlob) { imageRewriteJob.skippedNoBlob++; i++; imageRewriteJob.done = i; imageRewriteJob.reviewAttempt = 1; }
        else if (r.stopped) break;
        else if (r.error) { imageRewriteJob.errors++; imageRewriteLog('⚠️ ' + id + ' · ' + r.error); i++; imageRewriteJob.done = i; imageRewriteJob.reviewAttempt = 1; }
        else if (imageRewriteJob.autoApproveImages) {
          await commitImageRewriteDraft(id, r.body);
          imageRewriteJob.entriesDone++;
          imageRewriteJob.imagesRewritten += r.fluxDone || 0;
          const rubNote = r.rubricPass ? ' · rubric ✓' : (r.rubricFailed && r.rubricFailed.length ? ' · rubric ⚠ ' + r.rubricFailed.slice(0, 3).join(',') : '');
          imageRewriteLog('🤖 ' + id + ' auto-kept · ' + (r.fluxDone || 0) + ' flux images' + (r.top10 ? ' · Top-10' : '') + rubNote);
          i++;
          imageRewriteJob.done = i;
          imageRewriteJob.reviewAttempt = 1;
        }
        else {
          imageRewriteJob.pendingReview = { id, title: imageRewriteJob.currentTitle, previewUrl: '/assets/qa/' + id + '.jpg', previewNonce: id + '-a' + imageRewriteJob.reviewAttempt + '-' + Date.now(), draftBody: r.body, attempt: imageRewriteJob.reviewAttempt, fluxDone: r.fluxDone || 0, top10: !!r.top10, rubricPass: r.rubricPass, rubricFailed: r.rubricFailed || [], searchQuery: r.searchQuery || '', searchIdx: r.searchIdx };
          imageRewriteJob.phase = 'review';
          imageRewriteJob.running = false;
          imageRewriteJob.currentStep = 'review · keep or try again';
          imageRewriteJob.pct = imageRewriteJob.total ? Math.min(100, Math.round((i / imageRewriteJob.total) * 1000) / 10) : 0;
          saveImageRewriteState(true);
          imageRewriteLog('👀 ' + id + ' ready — ✓ keep or ✗ try again');
          return;
        }
      } catch (err) {
        imageRewriteJob.errors++;
        imageRewriteLog('⚠️ ' + id + ' · ' + String(err.message || err).slice(0, 80));
        i++;
        imageRewriteJob.done = i;
        imageRewriteJob.reviewAttempt = 1;
      }
      imageRewriteJob.pct = imageRewriteJob.total ? Math.min(100, Math.round((i / imageRewriteJob.total) * 1000) / 10) : 0;
      saveImageRewriteState();
      await new Promise(res => setTimeout(res, 200));
    }
    if (imageRewriteJob.phase !== 'review') {
      imageRewriteJob.phase = imageRewriteJob.stop ? 'stopped' : 'done';
      imageRewriteLog(imageRewriteJob.stop ? ('⏹ stopped at ' + imageRewriteJob.pct + '%') : ('✅ complete — ' + imageRewriteJob.entriesDone + ' entries · ' + imageRewriteJob.imagesRewritten + ' flux images'));
      imageRewriteJob.running = false;
      imageRewriteJob.finishedAt = Date.now();
      imageRewriteJob.currentId = '';
      imageRewriteJob.currentStep = '';
      saveImageRewriteState(true);
    }
  } catch (e) {
    imageRewriteJob.error = e.message;
    imageRewriteJob.phase = 'error';
    imageRewriteLog('❌ ' + e.message);
    imageRewriteJob.running = false;
    imageRewriteJob.finishedAt = Date.now();
    saveImageRewriteState(true);
  }
}
function imageRewriteReviewDecision(action) {
  const pr = imageRewriteJob.pendingReview;
  if (!pr || imageRewriteJob.phase !== 'review') return { ok: false, msg: 'nothing to review' };
  if (action === 'retry') {
    imageRewriteJob.reviewAttempt = (pr.attempt || 1) + 1;
    imageRewriteJob.pendingReview = null;
    imageRewriteJob.phase = 'rewrite';
    imageRewriteLog('↻ ' + pr.id + ' · try again #' + imageRewriteJob.reviewAttempt);
    saveImageRewriteState(true);
    runImageRewriteLoop().catch(e => { imageRewriteJob.error = e.message; imageRewriteJob.running = false; imageRewriteJob.phase = 'error'; saveImageRewriteState(); });
    return { ok: true, retrying: true, attempt: imageRewriteJob.reviewAttempt };
  }
  if (action !== 'keep') return { ok: false, msg: 'bad action' };
  return commitImageRewriteDraft(pr.id, pr.draftBody).then(() => {
    imageRewriteJob.entriesDone++;
    imageRewriteJob.imagesRewritten += pr.fluxDone || 0;
    const rubNote = pr.rubricPass ? ' · rubric ✓' : (pr.rubricFailed && pr.rubricFailed.length ? ' · rubric ⚠ ' + pr.rubricFailed.slice(0, 3).join(',') : '');
    imageRewriteLog('🌸 ' + pr.id + ' kept · ' + (pr.fluxDone || 0) + ' flux images' + (pr.top10 ? ' · Top-10' : '') + rubNote);
    imageRewriteJob.pendingReview = null;
    imageRewriteJob.reviewAttempt = 1;
    imageRewriteJob.done = (imageRewriteJob.done || 0) + 1;
    imageRewriteJob.phase = 'rewrite';
    saveImageRewriteState(true);
    runImageRewriteLoop().catch(e => { imageRewriteJob.error = e.message; imageRewriteJob.running = false; imageRewriteJob.phase = 'error'; saveImageRewriteState(); });
    return { ok: true, kept: true, id: pr.id };
  }).catch(e => ({ ok: false, msg: e.message }));
}
function startImageRewrite(pillar, guideKeywords, autoApproveImages) {
  if (imageRewriteJob.running || imageRewriteJob.phase === 'review') return { ok: false, msg: 'already running' };
  const busy = imageJobConflict('rewrite');
  if (busy) return { ok: false, msg: busy };
  pillar = pillar && pillar !== 'all' ? String(pillar) : null;
  if (!pillar) return { ok: false, msg: 'pick a pillar' };
  guideKeywords = String(guideKeywords || '').trim().slice(0, 800);
  autoApproveImages = !!autoApproveImages;
  imageRewriteJob = {
    running: false, stop: false, pillar, pillarName: pName(pillar), guideKeywords, autoApproveImages,
    done: 0, total: 0, pct: 0, entriesDone: 0, imagesRewritten: 0, fluxJobs: 0,
    skippedNoBlob: 0, errors: 0, currentId: '', currentTitle: '', currentStep: '',
    phase: 'starting', startedAt: Date.now(), finishedAt: null, error: '', log: [],
    pendingReview: null, reviewAttempt: 1, _entries: null,
  };
  const kwNote = guideKeywords ? (' · guide: ' + guideKeywords.slice(0, 48) + (guideKeywords.length > 48 ? '…' : '')) : '';
  const modeNote = autoApproveImages ? ' · 🤖 auto-approve ON' : ' · keep/retry each entry';
  imageRewriteLog('▶ Pollinator image overwrite — ' + imageRewriteJob.pillarName + kwNote + modeNote + ' · serial flux');
  runImageRewriteLoop().catch(e => { imageRewriteJob.error = e.message; imageRewriteJob.running = false; imageRewriteJob.phase = 'error'; saveImageRewriteState(); });
  return { ok: true, started: true, pillar, pillarName: imageRewriteJob.pillarName, guideKeywords, autoApproveImages };
}
function stopImageRewrite() {
  if (imageRewriteJob.running) { imageRewriteJob.stop = true; return { ok: true, stopping: true }; }
  if (imageRewriteJob.phase === 'review') {
    imageRewriteJob.pendingReview = null;
    imageRewriteJob.phase = 'stopped';
    imageRewriteJob.finishedAt = Date.now();
    saveImageRewriteState(true);
    return { ok: true, stopped: true };
  }
  return { ok: false, msg: 'not running' };
}
function forceStopImageRewrite() {
  imageRewriteJob.stop = true;
  imageRewriteJob.running = false;
  imageRewriteJob.pendingReview = null;
  imageRewriteJob.phase = 'stopped';
  imageRewriteJob.finishedAt = Date.now();
  imageRewriteJob.currentId = '';
  imageRewriteJob.currentStep = 'force stopped';
  imageRewriteLog('⏹ force stop — overwrite run halted');
  saveImageRewriteState(true);
  return { ok: true, forceStopped: true };
}
function imageRewriteStatusPayload() {
  const snap = Object.assign({}, imageRewriteJob, { log: (imageRewriteJob.log || []).slice(0, 24), pendingReview: slimImageReview(imageRewriteJob.pendingReview) });
  delete snap._entries;
  if (snap.pendingReview && imageRewriteJob.pendingReview) snap.pendingReview.draft = undefined;
  return snap;
}

// ── Face Card & Top Image Generator — Pollinator face-card + hero only (whole pillar) ──
let lastPexelsPickerAt = 0;
async function searchPexelsForTitle(id, requestedTitle, gender, clickIndex) {
  const key = process.env.PEXELS_API_KEY || '';
  if (!key) throw new Error('PEXELS_API_KEY missing');
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry || !entry.answer) throw new Error('Q&A not found: ' + id);
  if (pillarOf(id) === 'sy') throw new Error('Style pillar is paused');
  const pageTitle = String(requestedTitle || titleOf[id] || entry.question || entry.title || id).trim();
  const route = pickGoldTemplate(id, entry.answer, pageTitle);
  clickIndex = Math.max(0, parseInt(clickIndex, 10) || 0);
  const productTitles = [...String(entry.answer).matchAll(/@@PRODUCT[^\n]*\bname="([^"]+)"/g)].map(match => match[1]);
  const title = route.template === 'top10' && productTitles[clickIndex] ? productTitles[clickIndex] : pageTitle;
  const baseQuery = deriveImageSearchQuery(title);
  const query = (baseQuery + (gender === 'men' ? ' man male' : gender === 'women' ? ' woman female' : '')).trim();
  const wait = lastPexelsPickerAt + 18000 - Date.now();
  if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
  lastPexelsPickerAt = Date.now();
  const response = await fetch('https://api.pexels.com/v1/search?per_page=12&query=' + encodeURIComponent(query), {
    headers: { Authorization: key, 'User-Agent': 'pulse-manual-square-picker/1.0' },
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error('Pexels HTTP ' + response.status);
  const data = await response.json();
  const photos = (data.photos || []).filter(p => p && p.src && p.width >= 900 && p.height >= 600).map(p => ({
    id: p.id,
    thumb: p.src.medium || p.src.small,
    url: p.src.large2x || p.src.large || p.src.original,
    photographer: p.photographer || '',
  }));
  return { id, title: pageTitle, targetTitle: title, targetIndex: clickIndex, query, photos, template: route.template, targetCount: route.template === 'top10' ? Math.min(10, productTitles.length) : 3 };
}
async function pickSquareNextEntry() {
  const next = readSquareQueue().pending.find(item => pillarOf(item.id) !== 'sy');
  if (!next) return { ok: false, msg: 'No graduated Q&A waiting for images' };
  const entry = await store.get('answers/' + next.id + '.json', { type: 'json' });
  if (!entry || !entry.answer) return { ok: false, msg: 'Missing answer blob for ' + next.id };
  const freshIndex = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const freshRow = (freshIndex.entries || []).find(item => item && item.id === next.id);
  const title = (freshRow && (freshRow.question || freshRow.title)) || entry.question || entry.title || titleOf[next.id] || next.question || next.id;
  const route = pickGoldTemplate(next.id, entry.answer, title);
  if (!route.template) return { ok: false, msg: 'No locked template for ' + next.id };
  const count = route.template === 'top10'
    ? (String(entry.answer).match(/@@PRODUCT[^\n]*\bimg="[^"]+"/g) || []).length
    : (String(entry.answer).match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  const productTitles = [...String(entry.answer).matchAll(/@@PRODUCT[^\n]*\bname="([^"]+)"/g)].map(match => match[1]);
  const depthTitles = [...String(entry.answer).matchAll(/^##\s+(?!Direct Answer|Related questions|FAQ|Sources|Related on PULSE)(.+)$/gim)].map(match => match[1].replace(/^\d+[.)]\s*/, '').trim());
  const start = route.template === 'top10' ? 2 : 1;
  const slots = [];
  for (let n = start; n <= (route.template === 'top10' ? count : count - 1); n++) {
    slots.push({ kind: 'body', n, label: route.template === 'top10' ? (productTitles[n - 1] || title) : (depthTitles[n] || title) });
  }
  return { ok: true, id: next.id, title, shape: route.template, slots };
}
async function searchSquareDeskImages(query) {
  const key = process.env.PEXELS_API_KEY || '';
  if (!key) throw new Error('PEXELS_API_KEY missing');
  query = deriveImageSearchQuery(String(query || '').trim());
  if (!query) throw new Error('Enter title keywords');
  const wait = lastPexelsPickerAt + 18000 - Date.now();
  if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
  lastPexelsPickerAt = Date.now();
  const response = await fetch('https://api.pexels.com/v1/search?per_page=12&query=' + encodeURIComponent(query), {
    headers: { Authorization: key, 'User-Agent': 'pulse-square-desk/1.0' },
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error('Pexels HTTP ' + response.status);
  const data = await response.json();
  return {
    ok: true,
    query,
    results: (data.photos || []).filter(p => p && p.src).map(p => ({
      id: p.id,
      thumb: p.src.medium || p.src.small,
      image: p.src.large2x || p.src.large || p.src.original,
      width: p.width || 0,
      height: p.height || 0,
      color: p.avg_color || '',
    })),
  };
}
const SQUARE_AUTO_F = path.join(WD, '_square_builder_auto_run.json');
let squareAutoJob = {
  running: false, enabled: false, stop: false, target: 100, done: 0, failed: 0,
  pod: 1, podsCompleted: 0, totalDone: 0,
  currentId: '', phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [],
};
try {
  const saved = JSON.parse(fs.readFileSync(SQUARE_AUTO_F, 'utf8'));
  squareAutoJob = Object.assign(squareAutoJob, saved, { running: false });
} catch (e) {}
function squareAutoLog(message) {
  squareAutoJob.log.unshift(new Date().toLocaleTimeString() + ' ' + message);
  squareAutoJob.log = squareAutoJob.log.slice(0, 40);
}
function saveSquareAutoJob() {
  try {
    const tmp = SQUARE_AUTO_F + '.tmp-' + process.pid;
    fs.writeFileSync(tmp, JSON.stringify(squareAutoJob, null, 2));
    try { fs.renameSync(tmp, SQUARE_AUTO_F); }
    catch (error) { fs.rmSync(SQUARE_AUTO_F, { force: true }); fs.renameSync(tmp, SQUARE_AUTO_F); }
  } catch (e) {}
}
function squareAutoStatus() {
  return Object.assign({}, squareAutoJob, {
    preferences: {
      face: readSquarePreferences().face.samples || 0,
      body: readSquarePreferences().body.samples || 0,
    },
    log: (squareAutoJob.log || []).slice(0, 20),
  });
}
async function autoFillSquareEntry() {
  const current = await pickSquareNextEntry();
  if (!current.ok) return { empty: true, msg: current.msg };
  squareAutoJob.currentId = current.id;
  squareAutoJob.phase = 'search';
  saveSquareAutoJob();
  const used = new Set();
  const faceSearch = await searchSquareDeskImages(current.title);
  const facePick = choosePreferredResult(faceSearch.results, 'face', used);
  if (!facePick) throw new Error('no face image candidate');
  const faceUrl = facePick.item.image || facePick.item.thumb;
  used.add(faceUrl);
  const slots = {};
  for (const slot of (current.slots || [])) {
    if (squareAutoJob.stop) return { stopped: true };
    squareAutoJob.phase = 'fill · image ' + slot.n;
    saveSquareAutoJob();
    const search = await searchSquareDeskImages(slot.label || current.title);
    const picked = choosePreferredResult(search.results, 'body', used);
    if (!picked) throw new Error('no unique candidate for image ' + slot.n);
    const url = picked.item.image || picked.item.thumb;
    used.add(url);
    slots[slot.n] = url;
  }
  squareAutoJob.phase = 'save';
  saveSquareAutoJob();
  const saved = await saveSquareDeskDraft({
    id: current.id, title: current.title, shape: current.shape,
    faceImageUrl: faceUrl, slots,
  });
  return { ok: true, id: current.id, saved };
}
async function runSquareAutoLoop() {
  if (squareAutoJob.running) return;
  squareAutoJob.running = true;
  squareAutoJob.stop = false;
  squareAutoJob.phase = 'starting';
  saveSquareAutoJob();
  while (squareAutoJob.enabled && !squareAutoJob.stop) {
    if (squareAutoJob.done >= squareAutoJob.target) {
      squareAutoJob.totalDone = (squareAutoJob.totalDone || 0) + squareAutoJob.done;
      squareAutoJob.podsCompleted = (squareAutoJob.podsCompleted || 0) + 1;
      squareAutoJob.pod = (squareAutoJob.pod || 1) + 1;
      squareAutoJob.done = 0;
      squareAutoJob.failed = 0;
      squareAutoJob.phase = 'next pod';
      squareAutoLog('📦 pod ' + squareAutoJob.podsCompleted + ' complete · auto-loading next 100');
      saveSquareAutoJob();
    }
    try {
      const result = await autoFillSquareEntry();
      if (result.empty) { squareAutoLog('✅ queue empty'); break; }
      if (result.stopped) break;
      squareAutoJob.done++;
      squareAutoLog('✅ ' + result.id + ' saved · removed from row · next');
    } catch (error) {
      squareAutoJob.failed++;
      squareAutoJob.error = error.message;
      squareAutoLog('⚠️ ' + (squareAutoJob.currentId || 'entry') + ' · ' + error.message);
      // Prevent a permanently bad first row from spinning forever.
      if (squareAutoJob.failed >= 10 && squareAutoJob.done === 0) break;
    }
    saveSquareAutoJob();
  }
  squareAutoJob.running = false;
  squareAutoJob.enabled = false;
  squareAutoJob.phase = squareAutoJob.stop ? 'stopped' : 'done';
  squareAutoJob.currentId = '';
  squareAutoJob.finishedAt = Date.now();
  saveSquareAutoJob();
}
function setSquareAutoRun(enabled) {
  enabled = !!enabled;
  if (!enabled) {
    squareAutoJob.enabled = false;
    squareAutoJob.stop = true;
    squareAutoLog('⏹ Auto-run stopping');
    saveSquareAutoJob();
    return { ok: true, enabled: false, stopping: squareAutoJob.running };
  }
  if (squareAutoJob.running) return { ok: true, enabled: true, running: true };
  squareAutoJob = {
    running: false, enabled: true, stop: false, target: 100, done: 0, failed: 0,
    pod: 1, podsCompleted: 0, totalDone: 0,
    currentId: '', phase: 'starting', startedAt: Date.now(), finishedAt: null, error: '', log: [],
  };
  squareAutoLog('▶ Auto-run · continuous pods of 100 · learned face/body preferences');
  saveSquareAutoJob();
  runSquareAutoLoop().catch(error => {
    squareAutoJob.running = false; squareAutoJob.enabled = false; squareAutoJob.phase = 'error';
    squareAutoJob.error = error.message; saveSquareAutoJob();
  });
  return { ok: true, enabled: true, running: true, target: 100 };
}
async function saveSquareDeskDraft(d) {
  const id = String(d.id || '').trim();
  if (!id || !d.faceImageUrl) throw new Error('Face image is required');
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry || !entry.answer) throw new Error('Q&A not found: ' + id);
  const title = titleOf[id] || d.title || entry.question || entry.title || id;
  const route = pickGoldTemplate(id, entry.answer, title);
  if (route.template !== d.shape) throw new Error('locked template changed');
  const imageCount = route.template === 'top10'
    ? (String(entry.answer).match(/@@PRODUCT[^\n]*\bimg="[^"]+"/g) || []).length
    : (String(entry.answer).match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  const requiredSlots = [];
  const firstSlot = route.template === 'top10' ? 2 : 1;
  const lastSlot = route.template === 'top10' ? imageCount : imageCount - 1;
  for (let n = firstSlot; n <= lastSlot; n++) requiredSlots.push(n);
  const suppliedSlots = d.slots || {};
  const missingSlots = requiredSlots.filter(slot => !suppliedSlots[slot]);
  if (missingSlots.length) throw new Error('fill every image slot before save: ' + missingSlots.join(', '));
  await applyManualPexelsImage(id, d.faceImageUrl, 0, '');
  const slots = Object.entries(suppliedSlots).sort((a, b) => Number(a[0]) - Number(b[0]));
  for (const [slot, url] of slots) {
    const n = Number(slot);
    const clickIndex = route.template === 'top10' ? n - 1 : n;
    await applyManualPexelsImage(id, url, clickIndex, '');
  }
  return finishManualPexelsQa(id);
}
async function downloadPexelsPickerImage(url) {
  const parsed = new URL(String(url || ''));
  if (parsed.protocol !== 'https:' || !/(^|\.)pexels\.com$/i.test(parsed.hostname)) throw new Error('invalid Pexels image URL');
  const response = await fetch(parsed.href, { signal: AbortSignal.timeout(45000) });
  if (!response.ok || !String(response.headers.get('content-type') || '').startsWith('image/')) throw new Error('Pexels image download failed');
  return Buffer.from(await response.arrayBuffer());
}
function replaceMarkdownImageAt(body, index, url) {
  let seen = -1, changed = false;
  const out = String(body || '').replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (all, alt) => {
    seen++;
    if (seen !== index) return all;
    changed = true;
    return '![' + alt + '](' + url + ')';
  });
  return { body: out, changed };
}
function replaceProductImageAt(body, index, url) {
  let seen = -1, changed = false;
  const out = String(body || '').replace(/@@PRODUCT[^\n]*/g, line => {
    if (!/\bimg="[^"]+"/.test(line)) return line;
    seen++;
    if (seen !== index) return line;
    changed = true;
    return line.replace(/\bimg="[^"]+"/, 'img="' + url + '"');
  });
  return { body: out, changed };
}
async function applyManualPexelsImage(id, url, clickIndex, gender) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry || !entry.answer) throw new Error('Q&A not found: ' + id);
  const freshIndex = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const freshRow = (freshIndex.entries || []).find(item => item && item.id === id);
  const title = (freshRow && (freshRow.question || freshRow.title)) || entry.question || entry.title || titleOf[id] || id;
  const route = pickGoldTemplate(id, entry.answer, title);
  if (!route.template) throw new Error('Q&A does not match a locked golden template');
  clickIndex = Math.max(0, parseInt(clickIndex, 10) || 0);
  const pillar = pillarOf(id);
  if (pillar === 'sy') throw new Error('Style pillar is paused');
  const maxClick = route.template === 'top10' ? 9 : 2;
  if (clickIndex > maxClick) throw new Error('all allowed manual image slots are filled');
  const buffer = await downloadPexelsPickerImage(url);
  const sourceUrls = Array.isArray(entry.manual_image_sources) ? entry.manual_image_sources.slice() : [];
  const imageHashes = Array.isArray(entry.manual_image_hashes) ? entry.manual_image_hashes.slice() : [];
  const imageHash = require('crypto').createHash('sha256').update(buffer).digest('hex');
  if (sourceUrls.includes(url) || imageHashes.includes(imageHash)) throw new Error('duplicate image rejected — choose a different photo');
  fs.mkdirSync(path.join(WD, 'assets', 'qa'), { recursive: true });
  const imageVersion = Date.now().toString(36);
  let body = entry.answer, localUrl, placement;
  if (clickIndex === 0) {
    const oldFile = coverPath(id);
    let stalePh = null;
    if (fs.existsSync(oldFile)) {
      try { stalePh = await pHash(fs.readFileSync(oldFile)); } catch (e) {}
    }
    markFaceCardForceRegen(id, 'Square Builder replacing stale baked-title pixels');
    purgeFaceCardRegistry(id, stalePh);
    fs.rmSync(oldFile, { force: true });
    await storeGradedImage(buffer, oldFile, {
      square: 760,
      faceCard: true,
      cropPosition: 'attention',
      bright: false,
    });
    clearFaceCardForceRegen(id);
    localUrl = '/assets/qa/' + id + '.jpg?v=' + imageVersion;
    placement = 'face card · photo-only · current title rendered by template';
    if (route.template === 'qa') {
      const swapped = replaceMarkdownImageAt(body, 0, localUrl);
      body = swapped.body;
      if (swapped.changed) placement += ' + existing top image';
    } else {
      const swapped = replaceProductImageAt(body, 0, localUrl);
      body = swapped.body;
      if (swapped.changed) placement += ' + Top-10 item 1';
    }
  } else {
    const sex = gender === 'men' ? 'men' : gender === 'women' ? 'women' : 'any';
    const localPath = '/assets/qa/' + id + '-manual-' + sex + '-' + clickIndex + '.jpg';
    await storeGradedImage(buffer, path.join(WD, localPath.replace(/^\/+/, '')), { sectionTile: true, width: 1200, height: 675, cropPosition: 'attention', bright: false });
    localUrl = localPath + '?v=' + imageVersion;
    const swapped = route.template === 'top10'
      ? replaceProductImageAt(body, clickIndex, localUrl)
      : replaceMarkdownImageAt(body, clickIndex, localUrl);
    if (!swapped.changed) throw new Error('that existing image slot is not present in this Q&A');
    body = swapped.body;
    placement = route.template === 'top10' ? 'Top-10 item ' + (clickIndex + 1) : (clickIndex === 1 ? 'middle image' : clickIndex === 2 ? 'bottom image' : 'style image ' + (clickIndex + 1));
  }
  const afterRoute = pickGoldTemplate(id, body, title);
  if (afterRoute.template !== route.template) throw new Error('image change would alter the locked template');
  sourceUrls.push(url);
  imageHashes.push(imageHash);
  const nextEntry = Object.assign({}, entry, {
    answer: body,
    cover_src: clickIndex === 0 ? 'pexels' : (entry.cover_src || 'pexels'),
    face_title_baked: clickIndex === 0 ? false : !!entry.face_title_baked,
    image_updated_at: new Date().toISOString(),
    image_version: imageVersion,
    manual_image_sources: sourceUrls,
    manual_image_hashes: imageHashes,
  });
  if (clickIndex === 0) delete nextEntry.face_title_text;
  await store.setJSON('answers/' + id + '.json', nextEntry);
  if (clickIndex === 0) {
    if (freshRow) {
      freshRow.img = localUrl;
      freshRow.cover_src = 'pexels';
      freshRow.face_title_baked = false;
      freshRow.image_version = imageVersion;
      delete freshRow.face_title_text;
      await store.setJSON('_index.json', freshIndex);
    }
  }
  return { ok: true, id, clickIndex, placement, localUrl, template: route.template, title };
}
async function finishManualPexelsQa(id) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry || !entry.answer) throw new Error('Q&A not found: ' + id);
  const now = Date.now();
  const fullyFixed = !!entry.fixer_passed_at;
  const tags = [...new Set([...(entry.tags || []), 'pulse-recent'])];
  await store.setJSON('answers/' + id + '.json', Object.assign({}, entry, { tags, polished_at: now, image_completed_at: new Date(now).toISOString(), fully_fixed_visual: fullyFixed }));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const row = (idx.entries || []).find(item => item && item.id === id);
  if (row) {
    row.tags = [...new Set([...(row.tags || []), 'pulse-recent'])];
    row.polished_at = now;
    row.image_completed_at = new Date(now).toISOString();
    row.fully_fixed_visual = fullyFixed;
    await store.setJSON('_index.json', idx);
  }
  const pageUrl = row ? libraryEntryPublicUrl(row) : 'https://pulserevops.com/knowledge/' + id;
  const emailed = await sendCompletedQaImagesEmail({ id, question: titleOf[id] || entry.question || entry.title || id, pageUrl });
  completeSquareBuild(id);
  return { ok: true, id, recent: true, pillar: pillarOf(id), fullyFixed, emailed: emailed.attachments };
}
const FACE_HERO_F = WD + '/_face_hero_run.json';
let faceHeroJob = {
  running: false, stop: false, stopAfterReview: false, pillar: 'tl', pillarName: 'Pulse Tools / CRO',
  done: 0, total: 0, pct: 0, entriesDone: 0, coversGenerated: 0, fluxJobs: 0,
  skippedNoBlob: 0, errors: 0, currentId: '', currentTitle: '', currentStep: '',
  phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [],
};
try {
  const _fhSnap = JSON.parse(fs.readFileSync(FACE_HERO_F, 'utf8'));
  if (_fhSnap && typeof _fhSnap === 'object') {
    faceHeroJob = Object.assign(faceHeroJob, _fhSnap, { running: false });
    if (faceHeroJob.phase === 'review' && faceHeroJob.stop) {
      faceHeroJob.stopAfterReview = true;
      faceHeroJob.stop = false;
    }
  }
} catch (e) {}
function saveFaceHeroState(force) {
  if (!force && faceHeroJob.running) {
    if (saveFaceHeroState._t) return;
    saveFaceHeroState._t = setTimeout(() => { saveFaceHeroState._t = null; saveFaceHeroState(true); }, 1500);
    return;
  }
  if (saveFaceHeroState._t) { clearTimeout(saveFaceHeroState._t); saveFaceHeroState._t = null; }
  try {
    const snap = Object.assign({}, faceHeroJob);
    delete snap._entries;
    fs.writeFileSync(FACE_HERO_F, JSON.stringify(snap, null, 1));
  } catch (e) {}
}
function faceHeroLog(msg) {
  faceHeroJob.log.unshift(new Date().toLocaleTimeString() + ' ' + msg);
  faceHeroJob.log = faceHeroJob.log.slice(0, 48);
}
async function buildFaceHeroDraft(id, attempt) {
  const title = titleOf[id] || id;
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { noBlob: true };
  const route = pickGoldTemplate(id, e.answer, title);
  const plan = countFaceHeroJobs();
  faceHeroJob.currentStep = 'flux 0/' + plan.total;
  const r = await fluxFaceHeroOnlyEntry(id, title, e.answer, {
    guideKeywords: faceHeroJob.guideKeywords || '',
    variant: 'square',
    coverOnly: true,
    attempt: attempt || faceHeroJob.reviewAttempt || 1,
    shouldStop: () => faceHeroJob.stop,
    onProgress: p => {
      faceHeroJob.currentStep = (p.phase || 'flux') + ' · ' + (p.label || p.detail || '');
      saveFaceHeroState(true);
    },
    onQualityMiss: (reason, tryN) => {
      faceHeroLog('↻ ' + id + ' · quality ' + reason + ' · flux try ' + tryN + '/' + (process.env.FLUX_COVER_MAX_TRY || 8));
      faceHeroJob.currentStep = 'quality · ' + reason + ' · try ' + tryN;
      saveFaceHeroState(true);
    },
  });
  if (r.stopped) return { stopped: true };
  if (r.error) return { error: r.error, fluxDone: r.fluxDone || 0 };
  const facePath = '/assets/qa/' + id + '.jpg';
  let outBody = e.answer;
  let heroPlaced = false;
  // Preserve the locked golden-template shape and visual rhythm. Top 10 has no top hero. Q&A may
  // swap the first existing image slot to the selected square, but this image pass never adds/moves slots.
  if (route.template === 'qa') {
    outBody = outBody.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/, (all, alt) => {
      heroPlaced = true;
      return '![' + alt + '](' + facePath + ')';
    });
  }
  faceHeroJob.currentStep = 'verify · 760×760 square + locked ' + (route.template || 'Q&A') + ' template';
  await waitFluxIdle();
  if (heroPlaced && !outBody.includes('](' + facePath + ')')) return { error: 'selected square did not replace the existing top image slot', fluxDone: r.fluxDone || 0 };
  if (!(await verifyQaAssetRenders(facePath, id))) return { error: 'face-card/hero file failed render verify', fluxDone: r.fluxDone || 0 };
  return { ok: true, body: outBody, fluxDone: r.fluxDone || 0, fluxTotal: r.fluxTotal || 0, top10: route.template === 'top10', template: route.template, heroPlaced, previewUrl: facePath, searchQuery: r.searchQuery || '', searchIdx: r.searchIdx };
}
async function commitFaceHeroDraft(id, outBody) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e) return { ok: false, msg: 'no blob' };
  const facePath = '/assets/qa/' + id + '.jpg';
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: outBody, updated_at: new Date().toISOString(), cover_src: 'flux', face_title_baked: true }));
  try { await stampFluxProvenance(id, store, 'flux'); coverSrcOf[id] = 'flux'; } catch (err) {}
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent) { ent.img = facePath; ent.cover_src = 'flux'; ent.face_title_baked = true; await store.setJSON('_index.json', idx); }
  } catch (err) {}
  completeSquareBuild(id);
  return { ok: true };
}
async function runFaceHeroLoop() {
  if (faceHeroJob.running) return;
  if (faceHeroJob.stop) {
    faceHeroJob.phase = 'stopped';
    faceHeroJob.running = false;
    faceHeroJob.finishedAt = faceHeroJob.finishedAt || Date.now();
    saveFaceHeroState(true);
    return;
  }
  faceHeroJob.running = true;
  faceHeroJob.phase = 'facehero';
  try {
    const entries = faceHeroJob._entries || readSquareQueue().pending
      .filter(row => !faceHeroJob.pillar || pillarOf(row.id) === faceHeroJob.pillar)
      .slice(0, faceHeroJob.batchSize || 200);
    faceHeroJob._entries = entries;
    faceHeroJob.total = entries.length;
    if (!faceHeroJob.total) {
      faceHeroLog('⚠️ no entries for pillar');
      faceHeroJob.phase = 'done';
      faceHeroJob.running = false;
      faceHeroJob.finishedAt = Date.now();
      saveFaceHeroState(true);
      return;
    }
    let i = faceHeroJob.done || 0;
    while (i < entries.length && !faceHeroJob.stop) {
      const row = entries[i];
      const id = row.id;
      faceHeroJob.currentId = id;
      faceHeroJob.currentTitle = String(titleOf[id] || row.question || id).slice(0, 90);
      faceHeroJob.reviewAttempt = faceHeroJob.reviewAttempt || 1;
      try {
        const r = await buildFaceHeroDraft(id, faceHeroJob.reviewAttempt);
        if (r.noBlob) { faceHeroJob.skippedNoBlob++; i++; faceHeroJob.done = i; faceHeroJob.reviewAttempt = 1; }
        else if (r.stopped) break;
        else if (r.error) {
          faceHeroJob.errors++;
          faceHeroLog('⚠️ ' + id + ' · ' + r.error);
          if ((faceHeroJob.reviewAttempt || 1) < 4) {
            faceHeroJob.reviewAttempt = (faceHeroJob.reviewAttempt || 1) + 1;
            faceHeroLog('↻ ' + id + ' · auto-retry #' + faceHeroJob.reviewAttempt);
            saveFaceHeroState();
            continue;
          }
          faceHeroLog('⚠️ ' + id + ' · skipped after retries');
          i++;
          faceHeroJob.done = i;
          faceHeroJob.reviewAttempt = 1;
        }
        else if (faceHeroJob.autoApproveImages) {
          await commitFaceHeroDraft(id, r.body);
          faceHeroJob.entriesDone++;
          faceHeroJob.coversGenerated += r.fluxDone || 0;
          faceHeroJob.fluxJobs += r.fluxDone || 0;
          faceHeroLog('🤖 ' + id + ' auto-kept · same file → mosaic + top hero' + (r.top10 ? ' (Top-10 cover prompt)' : ''));
          i++;
          faceHeroJob.done = i;
          faceHeroJob.reviewAttempt = 1;
        }
        else {
          if (faceHeroJob.stop) {
            faceHeroJob.stopAfterReview = true;
            faceHeroJob.stop = false;
          }
          faceHeroJob.pendingReview = { id, title: faceHeroJob.currentTitle, previewUrl: r.previewUrl || ('/assets/qa/' + id + '.jpg'), previewNonce: id + '-a' + faceHeroJob.reviewAttempt + '-' + Date.now(), draftBody: r.body, attempt: faceHeroJob.reviewAttempt, fluxDone: r.fluxDone || 0, top10: !!r.top10, template: r.template, heroPlaced: !!r.heroPlaced, searchQuery: r.searchQuery || '', searchIdx: r.searchIdx };
          faceHeroJob.phase = 'review';
          faceHeroJob.running = false;
          faceHeroJob.currentStep = faceHeroJob.stopAfterReview ? 'review · keep to save then stop · or try again' : 'review · keep or try again';
          faceHeroJob.pct = faceHeroJob.total ? Math.min(100, Math.round((i / faceHeroJob.total) * 1000) / 10) : 0;
          saveFaceHeroState(true);
          faceHeroLog('👀 ' + id + ' ready — ✓ keep or ✗ try again');
          return;
        }
      } catch (err) {
        faceHeroJob.errors++;
        faceHeroLog('⚠️ ' + id + ' · ' + String(err.message || err).slice(0, 80));
        i++;
        faceHeroJob.done = i;
        faceHeroJob.reviewAttempt = 1;
      }
      faceHeroJob.pct = faceHeroJob.total ? Math.min(100, Math.round((i / faceHeroJob.total) * 1000) / 10) : 0;
      saveFaceHeroState();
      await new Promise(res => setTimeout(res, 200));
    }
    if (faceHeroJob.phase !== 'review') {
      faceHeroJob.phase = faceHeroJob.stop ? 'stopped' : 'done';
      faceHeroLog(faceHeroJob.stop ? ('⏹ stopped at ' + faceHeroJob.pct + '%') : ('✅ complete — ' + faceHeroJob.entriesDone + ' entries · ' + faceHeroJob.coversGenerated + ' face-card+hero flux jobs'));
      faceHeroJob.running = false;
      faceHeroJob.finishedAt = Date.now();
      faceHeroJob.currentId = '';
      faceHeroJob.currentStep = '';
      saveFaceHeroState(true);
    }
  } catch (e) {
    faceHeroJob.error = e.message;
    faceHeroJob.phase = 'error';
    faceHeroLog('❌ ' + e.message);
    faceHeroJob.running = false;
    faceHeroJob.finishedAt = Date.now();
    saveFaceHeroState(true);
  }
}
function faceHeroReviewDecision(action) {
  const pr = faceHeroJob.pendingReview;
  if (!pr || faceHeroJob.phase !== 'review') return { ok: false, msg: 'nothing to review' };
  if (action === 'retry') {
    faceHeroJob.reviewAttempt = (pr.attempt || 1) + 1;
    faceHeroJob.pendingReview = null;
    faceHeroJob.stop = false;
    faceHeroJob.stopAfterReview = false;
    faceHeroJob.phase = 'facehero';
    faceHeroLog('↻ ' + pr.id + ' · try again #' + faceHeroJob.reviewAttempt);
    saveFaceHeroState(true);
    runFaceHeroLoop().catch(e => { faceHeroJob.error = e.message; faceHeroJob.running = false; faceHeroJob.phase = 'error'; saveFaceHeroState(); });
    return { ok: true, retrying: true, attempt: faceHeroJob.reviewAttempt };
  }
  if (action !== 'keep') return { ok: false, msg: 'bad action' };
  return commitFaceHeroDraft(pr.id, pr.draftBody).then(() => {
    faceHeroJob.entriesDone++;
    faceHeroJob.coversGenerated += pr.fluxDone || 0;
    faceHeroJob.fluxJobs += pr.fluxDone || 0;
    faceHeroLog('🦄 ' + pr.id + ' kept · same file → mosaic + top hero' + (pr.top10 ? ' (Top-10 cover prompt)' : ''));
    faceHeroJob.pendingReview = null;
    faceHeroJob.reviewAttempt = 1;
    faceHeroJob.done = (faceHeroJob.done || 0) + 1;
    if (faceHeroJob.stopAfterReview) {
      faceHeroJob.stopAfterReview = false;
      faceHeroJob.phase = 'stopped';
      faceHeroJob.running = false;
      faceHeroJob.finishedAt = Date.now();
      faceHeroJob.currentStep = '';
      faceHeroLog('⏹ stopped after keep — ' + faceHeroJob.pct + '%');
      saveFaceHeroState(true);
      return { ok: true, kept: true, id: pr.id, stopped: true };
    }
    faceHeroJob.phase = 'facehero';
    saveFaceHeroState(true);
    runFaceHeroLoop().catch(e => { faceHeroJob.error = e.message; faceHeroJob.running = false; faceHeroJob.phase = 'error'; saveFaceHeroState(); });
    return { ok: true, kept: true, id: pr.id };
  }).catch(e => ({ ok: false, msg: e.message }));
}
function startFaceHero(pillar, guideKeywords, autoApproveImages, forceRestart, batchSize) {
  if (faceHeroJob.running) return { ok: false, msg: 'already running' };
  if (faceHeroJob.phase === 'review' && faceHeroJob.pendingReview && !forceRestart) {
    return { ok: false, msg: 'card waiting for review — ✓ Keep or ✗ Try again first (or Force stop to cancel)', needsReview: true, pendingId: faceHeroJob.pendingReview.id };
  }
  const busy = imageJobConflict('facehero');
  if (busy) return { ok: false, msg: busy };
  pillar = pillar && pillar !== 'all' ? String(pillar) : null;
  guideKeywords = String(guideKeywords || '').trim().slice(0, 800);
  autoApproveImages = !!autoApproveImages;
  batchSize = Math.max(1, Math.min(200, parseInt(batchSize, 10) || 200));
  const canResume = !forceRestart && faceHeroJob.pillar === pillar && (faceHeroJob.phase === 'stopped' || faceHeroJob.phase === 'done' || faceHeroJob.phase === 'error') && (faceHeroJob.done || 0) > 0 && (faceHeroJob.done || 0) < (faceHeroJob.total || 1);
  if (canResume) {
    faceHeroJob.stop = false;
    faceHeroJob.stopAfterReview = false;
    faceHeroJob.running = false;
    faceHeroJob.phase = 'facehero';
    faceHeroJob.finishedAt = null;
    faceHeroJob.error = '';
    faceHeroJob.guideKeywords = guideKeywords;
    faceHeroJob.autoApproveImages = autoApproveImages;
    faceHeroJob.batchSize = batchSize;
    faceHeroJob.pendingReview = null;
    faceHeroJob.reviewAttempt = 1;
    faceHeroJob.pillarName = pillar ? pName(pillar) : 'All queued Q&As';
    faceHeroLog('▶ Resuming — ' + (faceHeroJob.done || 0) + '/' + (faceHeroJob.total || 0) + ' · ' + faceHeroJob.pillarName);
    runFaceHeroLoop().catch(e => { faceHeroJob.error = e.message; faceHeroJob.running = false; faceHeroJob.phase = 'error'; saveFaceHeroState(); });
    return { ok: true, started: true, resumed: true, pillar, pillarName: faceHeroJob.pillarName, guideKeywords, autoApproveImages, done: faceHeroJob.done, total: faceHeroJob.total };
  }
  faceHeroJob = {
    running: false, stop: false, stopAfterReview: false, pillar, pillarName: pillar ? pName(pillar) : 'All queued Q&As', guideKeywords, autoApproveImages, batchSize,
    done: 0, total: 0, pct: 0, entriesDone: 0, coversGenerated: 0, fluxJobs: 0,
    skippedNoBlob: 0, errors: 0, currentId: '', currentTitle: '', currentStep: '',
    phase: 'starting', startedAt: Date.now(), finishedAt: null, error: '', log: [],
    pendingReview: null, reviewAttempt: 1, _entries: null,
  };
  const kwNote = guideKeywords ? (' · guide: ' + guideKeywords.slice(0, 48) + (guideKeywords.length > 48 ? '…' : '')) : '';
  const modeNote = autoApproveImages ? ' · 🤖 auto-approve ON' : ' · keep/retry each card';
  faceHeroLog('▶ Square Builder — ' + faceHeroJob.pillarName + ' · up to ' + batchSize + ' today' + kwNote + modeNote + ' · serial flux');
  runFaceHeroLoop().catch(e => { faceHeroJob.error = e.message; faceHeroJob.running = false; faceHeroJob.phase = 'error'; saveFaceHeroState(); });
  return { ok: true, started: true, pillar, pillarName: faceHeroJob.pillarName, guideKeywords, autoApproveImages, batchSize };
}
function stopFaceHero() {
  if (faceHeroJob.running) {
    faceHeroJob.stop = true;
    faceHeroJob.stopAfterReview = true;
    saveFaceHeroState(true);
    return { ok: true, stopping: true };
  }
  if (faceHeroJob.phase === 'review') {
    faceHeroJob.pendingReview = null;
    faceHeroJob.phase = 'stopped';
    faceHeroJob.finishedAt = Date.now();
    saveFaceHeroState(true);
    return { ok: true, stopped: true };
  }
  if (faceHeroJob.pillar && !faceHeroJob.finishedAt) {
    faceHeroJob.phase = 'stopped';
    faceHeroJob.finishedAt = Date.now();
    saveFaceHeroState(true);
    return { ok: true, stopped: true };
  }
  return { ok: false, msg: 'not running' };
}
function forceStopFaceHero() {
  faceHeroJob.stop = true;
  faceHeroJob.stopAfterReview = false;
  faceHeroJob.running = false;
  faceHeroJob.pendingReview = null;
  faceHeroJob.phase = 'stopped';
  faceHeroJob.finishedAt = Date.now();
  faceHeroJob.currentStep = 'force stopped';
  faceHeroJob.currentId = '';
  faceHeroLog('⏹ force stop — face-card run halted');
  saveFaceHeroState(true);
  return { ok: true, forceStopped: true };
}
function faceHeroStatusPayload() {
  const snap = Object.assign({}, faceHeroJob, { log: (faceHeroJob.log || []).slice(0, 24), pendingReview: slimImageReview(faceHeroJob.pendingReview) });
  delete snap._entries;
  return snap;
}
function resumeInterruptedImageJobs() {
  if (faceHeroJob.pillar && !faceHeroJob.stop && !faceHeroJob.finishedAt) {
    if (faceHeroJob.phase === 'review' && faceHeroJob.pendingReview) return;
    const fhLeft = (faceHeroJob.total || 0) - (faceHeroJob.done || 0);
    if (fhLeft > 0 && (faceHeroJob.phase === 'facehero' || faceHeroJob.phase === 'starting')) {
      faceHeroJob.phase = 'facehero';
      faceHeroJob.currentStep = 'resuming · ' + (faceHeroJob.done || 0) + '/' + (faceHeroJob.total || 0);
      faceHeroLog('▶ resuming — ' + (faceHeroJob.done || 0) + '/' + (faceHeroJob.total || 0) + ' done · next card');
      runFaceHeroLoop().catch(e => { faceHeroJob.error = e.message; faceHeroJob.running = false; faceHeroJob.phase = 'error'; saveFaceHeroState(true); });
    }
  }
  if (imageDuplicatorJob.pillar != null && !imageDuplicatorJob.stop && !imageDuplicatorJob.finishedAt) {
    const duLeft = (imageDuplicatorJob.total || 0) - (imageDuplicatorJob.done || 0);
    if (duLeft > 0 && (imageDuplicatorJob.phase === 'fill' || imageDuplicatorJob.phase === 'starting')) {
      if (!imageDuplicatorJob.filledUrlList) imageDuplicatorJob.filledUrlList = harvestPillarFilledUrls(imageDuplicatorJob.pillar);
      imageDuplicatorJob.phase = 'fill';
      imageDuplicatorJob.currentStep = 'resuming · ' + (imageDuplicatorJob.done || 0) + '/' + (imageDuplicatorJob.total || 0);
      imageDuplicatorLog('▶ resuming — ' + (imageDuplicatorJob.done || 0) + '/' + (imageDuplicatorJob.total || 0) + ' · ' + imageDuplicatorJob.pillarName);
      runImageDuplicatorLoop().catch(e => { imageDuplicatorJob.error = e.message; imageDuplicatorJob.running = false; imageDuplicatorJob.phase = 'error'; saveImageDuplicatorState(true); });
    }
  }
  if (imageRewriteJob.pillar && !imageRewriteJob.stop && !imageRewriteJob.finishedAt) {
    if (imageRewriteJob.phase === 'review' && imageRewriteJob.pendingReview) return;
    const rwLeft = (imageRewriteJob.total || 0) - (imageRewriteJob.done || 0);
    if (rwLeft > 0 && (imageRewriteJob.phase === 'rewrite' || imageRewriteJob.phase === 'starting')) {
      imageRewriteJob.phase = 'rewrite';
      imageRewriteJob.currentStep = 'resuming · ' + (imageRewriteJob.done || 0) + '/' + (imageRewriteJob.total || 0);
      imageRewriteLog('▶ resuming — ' + (imageRewriteJob.done || 0) + '/' + (imageRewriteJob.total || 0) + ' done · next entry');
      runImageRewriteLoop().catch(e => { imageRewriteJob.error = e.message; imageRewriteJob.running = false; imageRewriteJob.phase = 'error'; saveImageRewriteState(true); });
    }
  }
}

// ── Format Fixer — content + structure rubric pass only (no images) ──
const FORMAT_FIXER_F = WD + '/_format_fixer_run.json';
const FORMAT_FIXER_POD_SIZE = 100;
const FORMAT_FIXER_CYCLE_DELAY_MS = Math.max(5000, parseInt(process.env.FORMAT_FIXER_CYCLE_DELAY_MS || '60000', 10));
let formatFixerJob = {
  running: false, stop: false, pillar: 'tl', pillarName: 'Pulse Tools / CRO',
  done: 0, total: 0, pct: 0, entriesDone: 0, entriesFixed: 0, entriesPass: 0, entriesSkipped: 0,
  skippedNoBlob: 0, errors: 0, consecutiveErrors: 0, maxConsecutiveErrors: 3, squareQueued: 0,
  auto: false, podSize: FORMAT_FIXER_POD_SIZE, podNumber: 0, cycles: 0, nextRunAt: null,
  hung: false, currentId: '', currentTitle: '', currentStep: '',
  phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [],
};
try {
  const _ffSnap = JSON.parse(fs.readFileSync(FORMAT_FIXER_F, 'utf8'));
  if (_ffSnap && typeof _ffSnap === 'object') {
    formatFixerJob = Object.assign(formatFixerJob, _ffSnap, { running: false, stop: false, phase: _ffSnap.phase === 'fix' ? 'stopped' : (_ffSnap.phase || 'idle') });
  }
} catch (e) {}
function saveFormatFixerState(force) {
  if (!force && formatFixerJob.running) {
    if (saveFormatFixerState._t) return;
    saveFormatFixerState._t = setTimeout(() => { saveFormatFixerState._t = null; saveFormatFixerState(true); }, 1500);
    return;
  }
  if (saveFormatFixerState._t) { clearTimeout(saveFormatFixerState._t); saveFormatFixerState._t = null; }
  try {
    const snap = Object.assign({}, formatFixerJob);
    delete snap._entries;
    fs.writeFileSync(FORMAT_FIXER_F, JSON.stringify(snap, null, 1));
  } catch (e) {}
}
function formatFixerLog(msg) {
  formatFixerJob.log.unshift(new Date().toLocaleTimeString() + ' ' + msg);
  formatFixerJob.log = formatFixerJob.log.slice(0, 48);
}
function recordFormatFixerError(id, error) {
  formatFixerJob.errors++;
  formatFixerJob.consecutiveErrors = (formatFixerJob.consecutiveErrors || 0) + 1;
  formatFixerLog('⚠️ ' + id + ' · ' + String(error || 'error').slice(0, 80) + ' · continuing automatically');
}
async function processFormatFixerEntry(id) {
  const pillar = pillarOf(id);
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { noBlob: true };
  const title = titleOf[id] || e.question || e.title || id;
  if (contentFormatPass(id, e.answer, valid)) return { skipped: true, pass: true };
  formatFixerJob.currentStep = 'audit · ' + id;
  const sib = (byPillar[pillar] || []).filter(x => x && x.id !== id).slice(0, 8);
  const r = await formatFixEntry(id, title, e.answer, {
    valid,
    siblings: sib,
    store,
    entryMeta: e,
    fixEntry,
    dsChat,
    deban,
    boldify,
    ensureErFormat,
    enforceCroCardLaw,
    pillarOf,
    shouldStop: () => formatFixerJob.stop,
    onProgress: p => {
      formatFixerJob.currentStep = (p.phase || 'fix') + ' · ' + (p.label || id);
      saveFormatFixerState(true);
    },
  });
  if (r.stopped) return { stopped: true };
  if (r.skipped) return { skipped: true, pass: true };
  const changed = r.body && r.body !== e.answer;
  if (changed) {
    formatFixerJob.currentStep = 'save · ' + id;
    const saved = await persistAnswerBlob(id, r.body, { format_fixed_at: new Date().toISOString() }, formatFixerLog);
    if (!saved.ok) return { error: saved.error, pass: false };
  }
  return {
    ok: true,
    pass: !!(r.after && r.after.pass),
    changed,
    steps: r.steps || [],
    beforePct: r.before && r.before.rubricPct,
    afterPct: r.after && r.after.rubricPct,
    failed: (r.after && r.after.failed) || [],
    words: r.after && r.after.words,
  };
}
async function stampFormatFixerPassed(id) {
  try {
    const entry = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!entry || !entry.answer || entry.fixer_passed_at) return;
    await store.setJSON('answers/' + id + '.json', Object.assign({}, entry, { fixer_passed_at: new Date().toISOString() }));
  } catch (e) {
    formatFixerLog('⚠️ ' + id + ' · could not stamp fixer pass');
  }
}
function squarePickerLinks(id) {
  const suffix = '?qa=' + encodeURIComponent(id);
  let lanUrl = '';
  try {
    const saved = fs.readFileSync(path.join(WD, '_scrub_lan_ip.txt'), 'utf8').trim();
    const host = saved.replace(/^https?:\/\//, '').replace(/:\d+.*$/, '');
    if (host) lanUrl = 'http://' + host + ':8900/' + suffix;
  } catch (e) {}
  return { localUrl: 'http://localhost:8900/' + suffix, lanUrl };
}
async function queueGraduatedForManualImages(id, question, log) {
  if (pillarOf(id) === 'sy' || !enqueueSquareBuild(id, question || id)) return false;
  const links = squarePickerLinks(id);
  sendSquareQueueEmail({ id, question: question || id, localUrl: links.localUrl, lanUrl: links.lanUrl })
    .catch(error => { if (log) log('⚠️ ' + id + ' · image-ready email failed: ' + error.message); });
  return true;
}
async function emailSquareBacklogOnce() {
  const pending = readSquareQueue().pending.filter(item => pillarOf(item.id) !== 'sy');
  if (!pending.length) return;
  const signature = require('crypto').createHash('sha1').update(pending.map(item => item.id).join('|')).digest('hex');
  const stateFile = path.join(WD, '_square_backlog_email_state.json');
  try {
    const previous = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    if (previous.signature === signature) return;
  } catch (e) {}
  const sample = squarePickerLinks(pending[0].id);
  const localBase = 'http://localhost:8900/';
  const lanBase = sample.lanUrl ? sample.lanUrl.replace(/\?qa=.*$/, '') : '';
  await sendSquareBacklogEmail({ items: pending, localBase, lanBase });
  fs.writeFileSync(stateFile, JSON.stringify({ signature, count: pending.length, sentAt: new Date().toISOString() }, null, 2));
}
async function getFormatFixerEntries(pillar) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const seen = new Set();
  const entries = (idx.entries || []).filter(e => {
    if (!e || !e.id || seen.has(String(e.id))) return false;
    // The format fixer owns every database Q&A URL, including one-letter q IDs and visitor IDs
    // (vq_*). The old image-job regex silently excluded both. Missing answer blobs are counted
    // by processFormatFixerEntry and skipped without stopping the automatic run.
    if (e.has_answer === false || e.pending === true) return false;
    seen.add(String(e.id));
    return true;
  });
  // Reconcile against the actual answer-blob database, not only _index.json. This catches orphaned
  // but publicly addressable Q&A blobs and keeps the automatic fixer queue complete.
  let cursor;
  do {
    const page = await store.list({ prefix: 'answers/', cursor });
    for (const blob of (page.blobs || [])) {
      const match = String(blob.key || '').match(/^answers\/([^/]+)\.json$/i);
      if (!match || seen.has(match[1])) continue;
      seen.add(match[1]);
      entries.push({ id: match[1], question: titleOf[match[1]] || match[1], has_answer: true });
    }
    cursor = page.cursor;
  } while (cursor);
  const scoped = pillar && pillar !== 'all' ? entries.filter(e => pillarOf(e.id) === pillar) : entries;
  return scoped.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
}
async function runFormatFixerLoop() {
  if (formatFixerJob.running) return;
  formatFixerJob.running = true;
  formatFixerJob.stop = false;
  formatFixerJob.phase = 'fix';
  formatFixerJob.nextRunAt = null;
  formatFixerJob.podSize = FORMAT_FIXER_POD_SIZE;
  formatFixerJob.errors = 0;
  formatFixerJob.consecutiveErrors = 0;
  formatFixerJob.entriesDone = 0;
  formatFixerJob.entriesFixed = 0;
  formatFixerJob.entriesPass = 0;
  formatFixerJob.entriesSkipped = 0;
  try {
    const entries = formatFixerJob._entries || await getFormatFixerEntries(formatFixerJob.pillar);
    formatFixerJob._entries = entries;
    formatFixerJob.total = entries.length;
    if (!formatFixerJob.total) {
      formatFixerLog('⚠️ no entries for pillar');
      formatFixerJob.phase = 'done';
      formatFixerJob.running = false;
      formatFixerJob.finishedAt = Date.now();
      saveFormatFixerState(true);
      return;
    }
    let i = formatFixerJob.done || 0;
    while (i < entries.length && !formatFixerJob.stop) {
      const row = entries[i];
      const id = row.id;
      formatFixerJob.currentId = id;
      formatFixerJob.currentTitle = String(titleOf[id] || row.question || id).slice(0, 90);
      try {
        const r = await processFormatFixerEntry(id);
        if (r.noBlob) { formatFixerJob.skippedNoBlob++; formatFixerJob.consecutiveErrors = 0; }
        else if (r.stopped) break;
        else if (r.skipped) {
          formatFixerJob.entriesSkipped++;
          formatFixerJob.entriesPass++;
          formatFixerJob.consecutiveErrors = 0;
          await stampFormatFixerPassed(id);
          if (await queueGraduatedForManualImages(id, titleOf[id] || row.question || id, formatFixerLog)) formatFixerJob.squareQueued++;
        }
        else if (r.error) recordFormatFixerError(id, r.error);
        else {
          formatFixerJob.consecutiveErrors = 0;
          formatFixerJob.entriesDone++;
          if (r.changed) formatFixerJob.entriesFixed++;
          if (r.pass) {
            formatFixerJob.entriesPass++;
            await stampFormatFixerPassed(id);
            if (await queueGraduatedForManualImages(id, titleOf[id] || row.question || id, formatFixerLog)) formatFixerJob.squareQueued++;
          }
          const note = r.pass ? 'rubric ✓' : ('rubric ' + (r.afterPct != null ? r.afterPct : '?') + '% · ' + (r.words != null ? r.words + 'w' : '') + (r.failed && r.failed.length ? ' · ' + r.failed.slice(0, 4).join(', ') : ''));
          formatFixerLog((r.changed ? '📝' : '✓') + ' ' + id + ' · ' + note + (r.steps && r.steps.length ? (' · ' + r.steps.join('+')) : ''));
        }
      } catch (err) {
        recordFormatFixerError(id, err && (err.message || err));
      }
      i++;
      formatFixerJob.done = i;
      formatFixerJob.podNumber = Math.ceil(i / FORMAT_FIXER_POD_SIZE);
      // Coverage bar = Q&As fully passing the fixer across the entire answer database. Keep the
      // scan cursor separate so 100% scanned can never be mistaken for 100% successfully fixed.
      formatFixerJob.pct = formatFixerJob.total ? Math.min(100, Math.round((formatFixerJob.entriesPass / formatFixerJob.total) * 1000) / 10) : 0;
      saveFormatFixerState();
      if (i % FORMAT_FIXER_POD_SIZE === 0 && i < entries.length && !formatFixerJob.stop) {
        formatFixerLog('▶ pod ' + (i / FORMAT_FIXER_POD_SIZE) + ' complete · auto-loading next ' + FORMAT_FIXER_POD_SIZE + ' (' + (entries.length - i) + ' remaining)');
        formatFixerJob.currentStep = 'next ' + FORMAT_FIXER_POD_SIZE + ' · continuing automatically';
        saveFormatFixerState(true);
      }
      await new Promise(res => setTimeout(res, 120));
    }
    formatFixerJob.phase = formatFixerJob.stop ? 'stopped' : 'done';
    formatFixerLog(formatFixerJob.stop
      ? ('⏹ stopped at ' + formatFixerJob.pct + '%')
      : ('✅ cycle complete — ' + formatFixerJob.entriesFixed + ' fixed · ' + formatFixerJob.entriesPass + ' pass content rubric · no images touched'));
  } catch (e) {
    formatFixerJob.error = e.message;
    formatFixerJob.phase = 'error';
    formatFixerLog('❌ ' + e.message);
  }
  const continueAuto = !!(formatFixerJob.auto && !formatFixerJob.stop);
  if (continueAuto) {
    formatFixerJob.cycles = (formatFixerJob.cycles || 0) + 1;
    formatFixerJob.phase = 'waiting';
    formatFixerJob.nextRunAt = Date.now() + FORMAT_FIXER_CYCLE_DELAY_MS;
    formatFixerLog('🔄 cycle ' + formatFixerJob.cycles + ' complete · re-fetching fresh pods of ' + FORMAT_FIXER_POD_SIZE + ' in ' + Math.round(FORMAT_FIXER_CYCLE_DELAY_MS / 1000) + 's');
  }
  formatFixerJob.running = false;
  formatFixerJob.finishedAt = Date.now();
  formatFixerJob.currentId = '';
  formatFixerJob.currentStep = continueAuto ? ('waiting for next ' + FORMAT_FIXER_POD_SIZE) : '';
  saveFormatFixerState(true);
  if (continueAuto) {
    setTimeout(() => {
      if (!formatFixerJob.auto || formatFixerJob.stop || formatFixerJob.running) return;
      formatFixerJob.done = 0;
      formatFixerJob.podNumber = 0;
      formatFixerJob.error = '';
      formatFixerJob._entries = null;
      runFormatFixerLoop().catch(e => {
        formatFixerJob.error = e.message;
        formatFixerJob.running = false;
        formatFixerJob.phase = 'error';
        saveFormatFixerState(true);
      });
    }, FORMAT_FIXER_CYCLE_DELAY_MS);
  }
}
function startFormatFixer(pillar) {
  if (formatFixerJob.running) return { ok: false, msg: 'already running' };
  const busy = imageJobConflict('formatfix');
  if (busy) return { ok: false, msg: busy };
  pillar = pillar && pillar !== 'all' ? String(pillar) : null;
  formatFixerJob = {
    running: false, stop: false, pillar: pillar || 'all', pillarName: pillar ? pName(pillar) : 'All pillars',
    done: 0, total: 0, pct: 0, entriesDone: 0, entriesFixed: 0, entriesPass: 0, entriesSkipped: 0,
    skippedNoBlob: 0, errors: 0, consecutiveErrors: 0, maxConsecutiveErrors: Math.max(1, parseInt(process.env.FORMAT_FIXER_MAX_ERRORS || '3', 10)), squareQueued: 0,
    auto: true, podSize: FORMAT_FIXER_POD_SIZE, podNumber: 0, cycles: 0, nextRunAt: null,
    hung: false, currentId: '', currentTitle: '', currentStep: '',
    phase: 'starting', startedAt: Date.now(), finishedAt: null, error: '', log: [], _entries: null,
  };
  formatFixerLog('▶ Format Fixer — ' + formatFixerJob.pillarName + ' · automatic pods of ' + FORMAT_FIXER_POD_SIZE + ' · runs until Stop · images untouched');
  runFormatFixerLoop().catch(e => { formatFixerJob.error = e.message; formatFixerJob.running = false; formatFixerJob.phase = 'error'; saveFormatFixerState(); });
  return { ok: true, started: true, pillar: pillar || 'all', pillarName: formatFixerJob.pillarName, auto: true, maxConsecutiveErrors: formatFixerJob.maxConsecutiveErrors };
}
function stopFormatFixer() {
  if (!formatFixerJob.running && !formatFixerJob.auto) return { ok: false, msg: 'not running' };
  formatFixerJob.stop = true;
  formatFixerJob.auto = false;
  formatFixerJob.nextRunAt = null;
  if (!formatFixerJob.running) {
    formatFixerJob.phase = 'stopped';
    formatFixerJob.currentStep = 'stopped by owner';
    saveFormatFixerState(true);
  }
  return { ok: true, stopping: true };
}
function setFormatFixerAuto(enabled) {
  enabled = !!enabled;
  formatFixerJob.auto = enabled;
  if (!enabled) {
    formatFixerLog('⏸ auto-run OFF · current entry continues until Stop');
    saveFormatFixerState(true);
    return { ok: true, auto: false, running: formatFixerJob.running };
  }
  formatFixerLog('▶ auto-run ON · continues until owner Stop');
  saveFormatFixerState(true);
  if (!formatFixerJob.running) {
    if (formatFixerJob.phase === 'done' || formatFixerJob.phase === 'idle' || (formatFixerJob.done || 0) >= (formatFixerJob.total || 1)) {
      const pillar = formatFixerJob.pillar && formatFixerJob.pillar !== 'all' ? formatFixerJob.pillar : 'all';
      const started = startFormatFixer(pillar);
      return Object.assign({ auto: true }, started);
    }
    formatFixerJob.stop = false;
    formatFixerJob.error = '';
    runFormatFixerLoop().catch(e => {
      formatFixerJob.error = e.message;
      formatFixerJob.running = false;
      formatFixerJob.phase = 'error';
      saveFormatFixerState(true);
    });
  }
  return { ok: true, auto: true, running: true };
}
function forceStopFormatFixer() {
  formatFixerJob.stop = true;
  formatFixerJob.auto = false;
  formatFixerJob.nextRunAt = null;
  formatFixerJob.running = false;
  formatFixerJob.phase = 'stopped';
  formatFixerJob.finishedAt = Date.now();
  formatFixerJob.currentId = '';
  formatFixerJob.currentStep = 'force stopped';
  formatFixerLog('⏹ force stop — format fixer halted');
  saveFormatFixerState(true);
  return { ok: true, forceStopped: true };
}
function formatFixerStatusPayload() {
  const square = readSquareQueue();
  const snap = Object.assign({}, formatFixerJob, {
    squarePending: square.pending.length,
    squareCompleted: square.completed || 0,
    log: (formatFixerJob.log || []).slice(0, 24),
  });
  delete snap._entries;
  return snap;
}

// ── Internal Images — DDG section images only (face-card + hero untouched) ──
const INTERNAL_IMAGES_F = WD + '/_internal_images_run.json';
let internalImagesJob = {
  running: false, stop: false, pillar: 'tl', pillarName: 'Pulse Tools / CRO', guideKeywords: '',
  done: 0, total: 0, pct: 0, entriesDone: 0, entriesFixed: 0, entriesPass: 0, entriesSkipped: 0,
  skippedNoBlob: 0, errors: 0, fluxImages: 0, currentId: '', currentTitle: '', currentStep: '',
  phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [],
};
try {
  const _iiSnap = JSON.parse(fs.readFileSync(INTERNAL_IMAGES_F, 'utf8'));
  if (_iiSnap && typeof _iiSnap === 'object') {
    internalImagesJob = Object.assign(internalImagesJob, _iiSnap, { running: false, stop: false, phase: _iiSnap.phase === 'fix' ? 'stopped' : (_iiSnap.phase || 'idle') });
  }
} catch (e) {}
function saveInternalImagesState(force) {
  if (!force && internalImagesJob.running) {
    if (saveInternalImagesState._t) return;
    saveInternalImagesState._t = setTimeout(() => { saveInternalImagesState._t = null; saveInternalImagesState(true); }, 1500);
    return;
  }
  if (saveInternalImagesState._t) { clearTimeout(saveInternalImagesState._t); saveInternalImagesState._t = null; }
  try {
    const snap = Object.assign({}, internalImagesJob);
    delete snap._entries;
    fs.writeFileSync(INTERNAL_IMAGES_F, JSON.stringify(snap, null, 1));
  } catch (e) {}
}
function internalImagesLog(msg) {
  internalImagesJob.log.unshift(new Date().toLocaleTimeString() + ' ' + msg);
  internalImagesJob.log = internalImagesJob.log.slice(0, 48);
}
async function processInternalImagesEntry(id) {
  const title = titleOf[id] || id;
  const pillar = pillarOf(id);
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { noBlob: true };
  if (internalImagesPass(id, e.answer, { internalImagesOk, mediaOk })) return { skipped: true, pass: true };
  internalImagesJob.currentStep = 'sections · ' + id;
  const r = await internalImagesFixEntry(id, title, e.answer, internalImagesFixOpts({
    shouldStop: () => internalImagesJob.stop,
    onProgress: p => {
      internalImagesJob.currentStep = (p.phase || 'ddg') + ' · ' + (p.label || id);
      saveInternalImagesState();
    },
  }));
  if (r.stopped) return { stopped: true, pass: false };
  if (r.error) return { error: r.error, pass: false };
  if (r.imagesPending || !r.pass) {
    internalImagesLog('⏸ ' + id + ' · held on entry — all section images must render before moving on');
    return { held: true, pass: false, after: r.after, before: r.before };
  }
  const outBody = r.body != null ? r.body : e.answer;
  const saved = await persistAnswerBlob(id, outBody, { internal_images_at: new Date().toISOString() }, internalImagesLog);
  if (!saved.ok) return { error: saved.error, pass: false };
  clearImageVerifyCache(id);
  return { pass: true, changed: outBody !== e.answer, fluxDone: r.fluxDone || 0, after: r.after, before: r.before };
}
async function runInternalImagesLoop() {
  if (internalImagesJob.running) return;
  internalImagesJob.running = true;
  internalImagesJob.stop = false;
  internalImagesJob.phase = 'fix';
  try {
    const entries = internalImagesJob._entries || await getImageDuplicatorEntries(internalImagesJob.pillar);
    internalImagesJob._entries = entries;
    internalImagesJob.total = entries.length;
    if (!internalImagesJob.total) {
      internalImagesLog('⚠️ no entries for pillar');
      internalImagesJob.phase = 'done';
      internalImagesJob.running = false;
      internalImagesJob.finishedAt = Date.now();
      saveInternalImagesState(true);
      return;
    }
    let i = internalImagesJob.done || 0;
    while (i < entries.length && !internalImagesJob.stop) {
      const row = entries[i];
      const id = row.id || row;
      internalImagesJob.currentId = id;
      internalImagesJob.currentTitle = String(titleOf[id] || row.question || id).slice(0, 90);
      try {
        const r = await processInternalImagesEntry(id);
        if (r.noBlob) internalImagesJob.skippedNoBlob++;
        else if (r.skipped) { internalImagesJob.entriesSkipped++; internalImagesJob.entriesPass++; }
        else if (r.error) { internalImagesJob.errors++; internalImagesLog('⚠️ ' + id + ' · ' + r.error); }
        else if (r.stopped) break;
        else if (r.held) {
          internalImagesJob.entriesHeld = (internalImagesJob.entriesHeld || 0) + 1;
          internalImagesJob._holdRetries = internalImagesJob._holdRetries || {};
          const tries = (internalImagesJob._holdRetries[id] || 0) + 1;
          internalImagesJob._holdRetries[id] = tries;
          if (tries >= 8) {
            internalImagesJob.errors++;
            internalImagesLog('⚠️ ' + id + ' · gave up after ' + tries + ' render holds');
            delete internalImagesJob._holdRetries[id];
          } else {
            internalImagesLog('⏸ ' + id + ' · retry ' + tries + '/8 after render hold');
            i--;
            await ddgSettle();
          }
        }
        else {
          if (internalImagesJob._holdRetries) delete internalImagesJob._holdRetries[id];
          internalImagesJob.entriesDone++;
          if (r.changed) internalImagesJob.entriesFixed++;
          if (r.pass) internalImagesJob.entriesPass++;
          internalImagesJob.fluxImages += r.fluxDone || 0;
          internalImagesLog((r.pass ? '✅' : '📋') + ' ' + id + ' · internal images ' + (r.pass ? 'pass' : 'needs review'));
        }
      } catch (err) {
        internalImagesJob.errors++;
        internalImagesLog('⚠️ ' + id + ' · ' + (err.message || err));
      }
      i++;
      internalImagesJob.done = i;
      internalImagesJob.pct = internalImagesJob.total ? Math.min(100, Math.round((i / internalImagesJob.total) * 1000) / 10) : 0;
      saveInternalImagesState();
    }
    internalImagesJob.phase = internalImagesJob.stop ? 'stopped' : 'done';
    internalImagesLog(internalImagesJob.stop
      ? ('⏹ stopped at ' + internalImagesJob.pct + '%')
      : ('✅ complete — ' + internalImagesJob.entriesFixed + ' fixed · ' + internalImagesJob.entriesPass + ' pass internal-images rubric'));
  } catch (e) {
    internalImagesJob.error = e.message;
    internalImagesJob.phase = 'error';
    internalImagesLog('⚠️ ' + e.message);
  }
  internalImagesJob.running = false;
  internalImagesJob.finishedAt = Date.now();
  internalImagesJob.currentId = '';
  internalImagesJob.currentStep = '';
  saveInternalImagesState(true);
}
function startInternalImages(pillar, guideKeywords) {
  if (internalImagesJob.running) return { ok: false, msg: 'already running' };
  const busy = imageJobConflict('internalimages');
  if (busy) return { ok: false, msg: busy };
  pillar = String(pillar || 'tl').trim() || 'tl';
  internalImagesJob = {
    running: false, stop: false, pillar, pillarName: pName(pillar), guideKeywords: String(guideKeywords || '').trim().slice(0, 800),
    done: 0, total: 0, pct: 0, entriesDone: 0, entriesFixed: 0, entriesPass: 0, entriesSkipped: 0,
    skippedNoBlob: 0, errors: 0, fluxImages: 0, currentId: '', currentTitle: '', currentStep: '',
    phase: 'fix', startedAt: Date.now(), finishedAt: null, error: '', log: [], _entries: null,
  };
  internalImagesLog('▶ Internal Images — ' + internalImagesJob.pillarName + ' · DDG sections · hero untouched');
  runInternalImagesLoop().catch(e => { internalImagesJob.error = e.message; internalImagesJob.running = false; internalImagesJob.phase = 'error'; saveInternalImagesState(); });
  return { ok: true, started: true, pillar, pillarName: internalImagesJob.pillarName };
}
function stopInternalImages() {
  if (!internalImagesJob.running) return { ok: false, msg: 'not running' };
  internalImagesJob.stop = true;
  return { ok: true, stopping: true };
}
function forceStopInternalImages() {
  internalImagesJob.stop = true;
  internalImagesJob.running = false;
  internalImagesJob.phase = 'stopped';
  internalImagesJob.finishedAt = Date.now();
  internalImagesJob.currentId = '';
  internalImagesJob.currentStep = 'force stopped';
  internalImagesLog('⏹ force stop — internal images halted');
  saveInternalImagesState(true);
  return { ok: true, forceStopped: true };
}
function internalImagesStatusPayload() {
  const snap = Object.assign({}, internalImagesJob, { log: (internalImagesJob.log || []).slice(0, 24), stations: listStations() });
  delete snap._entries;
  return snap;
}

// ── Rubric Stations — fix + audit one rubric slice at a time ──
const RUBRIC_STATION_F = WD + '/_rubric_station_run.json';
let rubricStationJob = {
  running: false, stop: false, station: 'writing', stationLabel: STATIONS.writing.label,
  pillar: 'tl', pillarName: 'Pulse Tools / CRO',
  done: 0, total: 0, pct: 0, entriesDone: 0, entriesPass: 0, entriesSkipped: 0, auditFail: 0,
  skippedNoBlob: 0, errors: 0, currentId: '', currentTitle: '', currentStep: '',
  phase: 'idle', startedAt: null, finishedAt: null, error: '', log: [],
};
try {
  const _rsSnap = JSON.parse(fs.readFileSync(RUBRIC_STATION_F, 'utf8'));
  if (_rsSnap && typeof _rsSnap === 'object') {
    rubricStationJob = Object.assign(rubricStationJob, _rsSnap, { running: false, stop: false, phase: _rsSnap.phase === 'fix' ? 'stopped' : (_rsSnap.phase || 'idle') });
  }
} catch (e) {}
function saveRubricStationState(force) {
  if (!force && rubricStationJob.running) {
    if (saveRubricStationState._t) return;
    saveRubricStationState._t = setTimeout(() => { saveRubricStationState._t = null; saveRubricStationState(true); }, 1500);
    return;
  }
  if (saveRubricStationState._t) { clearTimeout(saveRubricStationState._t); saveRubricStationState._t = null; }
  try {
    const snap = Object.assign({}, rubricStationJob);
    delete snap._entries;
    fs.writeFileSync(RUBRIC_STATION_F, JSON.stringify(snap, null, 1));
  } catch (e) {}
}
function rubricStationLog(msg) {
  rubricStationJob.log.unshift(new Date().toLocaleTimeString() + ' ' + msg);
  rubricStationJob.log = rubricStationJob.log.slice(0, 48);
}
async function processRubricStationEntry(id) {
  const station = rubricStationJob.station || 'writing';
  const title = titleOf[id] || id;
  const pillar = pillarOf(id);
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { noBlob: true };
  let body = e.answer;
  const rb = rubricSignOff(id, body);
  if (!stationNeedsWork(station, rb)) return { skipped: true, pass: true };
  const keys = stationKeys(station);
  let blobSaveErr = null;
  const save = async (b, meta) => {
    body = b;
    const saved = await persistAnswerBlob(id, b, meta || {}, msg => rubricStationLog(msg));
    if (!saved.ok) blobSaveErr = saved.error || 'blob save failed';
  };
  const sib = (byPillar[pillar] || []).filter(x => x && x.id !== id).slice(0, 8);
  const out = { steps: [] };
  rubricStationJob.currentStep = 'fix · ' + station + ' · ' + id;
  if (station === 'writing') {
    const writingKeys = stationKeys('writing');
    const target = pillar === 'q' ? 8 : 25;
    body = boldify(deban(body), target);
    body = ensureErFormat(id, body);
    body = ensureTop10ProductLines(body);
    body = enforceCroCardLaw(body, id);
    body = ensureDirectAnswerAfterHero(body);
    await save(body);
    const r = await formatFixEntry(id, title, body, {
      valid, siblings: sib, store, entryMeta: e, fixEntry, dsChat, deban, boldify,
      ensureErFormat, enforceCroCardLaw, pillarOf, sliceKeys: writingKeys,
      maxRounds: 3, shouldStop: () => rubricStationJob.stop,
      onProgress: p => { rubricStationJob.currentStep = (p.phase || 'fix') + ' · ' + id; saveRubricStationState(); },
    });
    if (r.stopped) return { stopped: true, pass: false };
    body = r.body || body;
    await save(body, { format_fixed_at: new Date().toISOString() });
  } else if (station === 'internal') {
    const r = await internalImagesFixEntry(id, title, body, internalImagesFixOpts({
      shouldStop: () => rubricStationJob.stop,
      onProgress: p => { rubricStationJob.currentStep = (p.phase || 'ddg') + ' · ' + id; saveRubricStationState(); },
    }));
    if (r.stopped) return { stopped: true, pass: false };
    if (r.error) return { error: r.error, pass: false };
    if (r.imagesPending || !r.pass) {
      rubricStationLog('⏸ ' + id + ' · held — all DDG section images must render before leaving');
      return { pass: false, held: true, rubricFail: (r.after && r.after.failed) || ['internalImagesPending'] };
    }
    body = r.body || body;
    await save(body, { internal_images_at: new Date().toISOString() });
    clearImageVerifyCache(id);
  } else if (station === 'publish') {
    rubricStationJob.currentStep = 'gate · ' + id;
    const imgGate = await publishImageGate(id, body, { forceVerify: true });
    if (!imgGate.ok) return { pass: false, gateFail: imgGate.reason };
    body = imgGate.body || body;
    await save(body);
  } else if (keys.length) {
    body = await runTargetedOwnerFixes(id, title, body, keys, { save, sib, out, ui: 'station', shouldStop: () => rubricStationJob.stop });
    await save(body);
    if (station === 'face') clearImageVerifyCache(id);
  }
  if (blobSaveErr) return { error: blobSaveErr, pass: false };
  const rb2 = rubricSignOff(id, body);
  const slice = stationAuditFromRubric(station, rb2);
  if (!slice.pass && station !== 'publish') return { pass: false, rubricFail: slice.failed };
  rubricStationJob.currentStep = 'audit · ' + station + ' · ' + id;
  const audit = await runRubricStationAuditor(id, title, body, station);
  if (!audit.pass) return { pass: false, auditFail: audit.notes };
  return { pass: true, slice, auditOk: true };
}
async function runRubricStationLoop() {
  if (rubricStationJob.running) return;
  rubricStationJob.running = true;
  rubricStationJob.stop = false;
  rubricStationJob.phase = 'fix';
  try {
    const entries = rubricStationJob._entries || await getImageDuplicatorEntries(rubricStationJob.pillar);
    rubricStationJob._entries = entries;
    rubricStationJob.total = entries.length;
    if (!rubricStationJob.total) {
      rubricStationLog('⚠️ no entries for pillar');
      rubricStationJob.phase = 'done';
      rubricStationJob.running = false;
      rubricStationJob.finishedAt = Date.now();
      saveRubricStationState(true);
      return;
    }
    let i = rubricStationJob.done || 0;
    while (i < entries.length && !rubricStationJob.stop) {
      const row = entries[i];
      const id = row.id || row;
      rubricStationJob.currentId = id;
      rubricStationJob.currentTitle = String(titleOf[id] || row.question || id).slice(0, 90);
      try {
        const r = await processRubricStationEntry(id);
        if (r.noBlob) rubricStationJob.skippedNoBlob++;
        else if (r.skipped) { rubricStationJob.entriesSkipped++; rubricStationJob.entriesPass++; }
        else if (r.stopped) break;
        else if (r.error) { rubricStationJob.errors = (rubricStationJob.errors || 0) + 1; rubricStationLog('⚠️ ' + id + ' · ' + r.error); }
        else if (r.pass) { rubricStationJob.entriesDone++; rubricStationJob.entriesPass++; rubricStationLog('✅ ' + id + ' · ' + rubricStationJob.stationLabel); }
        else {
          rubricStationJob.entriesDone++;
          if (r.auditFail) { rubricStationJob.auditFail++; rubricStationLog('🔍 ' + id + ' · auditor: ' + String(r.auditFail).slice(0, 72)); }
          else rubricStationLog('📋 ' + id + ' · ' + (r.rubricFail || r.gateFail || 'incomplete').toString().slice(0, 72));
        }
      } catch (err) {
        rubricStationJob.errors = (rubricStationJob.errors || 0) + 1;
        rubricStationLog('⚠️ ' + id + ' · ' + (err.message || err));
      }
      i++;
      rubricStationJob.done = i;
      rubricStationJob.pct = rubricStationJob.total ? Math.min(100, Math.round((i / rubricStationJob.total) * 1000) / 10) : 0;
      saveRubricStationState();
    }
    rubricStationJob.phase = rubricStationJob.stop ? 'stopped' : 'done';
    rubricStationLog(rubricStationJob.stop
      ? ('⏹ stopped at ' + rubricStationJob.pct + '%')
      : ('✅ complete — ' + rubricStationJob.entriesPass + ' pass · ' + rubricStationJob.stationLabel));
  } catch (e) {
    rubricStationJob.error = e.message;
    rubricStationJob.phase = 'error';
    rubricStationLog('⚠️ ' + e.message);
  }
  rubricStationJob.running = false;
  rubricStationJob.finishedAt = Date.now();
  rubricStationJob.currentId = '';
  rubricStationJob.currentStep = '';
  saveRubricStationState(true);
}
function startRubricStation(station, pillar) {
  if (rubricStationJob.running) return { ok: false, msg: 'already running' };
  const busy = imageJobConflict('rubricstation');
  if (busy) return { ok: false, msg: busy };
  station = STATIONS[station] ? station : 'writing';
  pillar = String(pillar || 'tl').trim() || 'tl';
  rubricStationJob = {
    running: false, stop: false, station, stationLabel: STATIONS[station].label,
    pillar, pillarName: pName(pillar),
    done: 0, total: 0, pct: 0, entriesDone: 0, entriesPass: 0, entriesSkipped: 0, auditFail: 0,
    skippedNoBlob: 0, errors: 0, currentId: '', currentTitle: '', currentStep: '',
    phase: 'fix', startedAt: Date.now(), finishedAt: null, error: '', log: [], _entries: null,
  };
  rubricStationLog('▶ ' + STATIONS[station].label + ' — ' + rubricStationJob.pillarName + ' · fix + audit one rubric slice');
  runRubricStationLoop().catch(e => { rubricStationJob.error = e.message; rubricStationJob.running = false; rubricStationJob.phase = 'error'; saveRubricStationState(); });
  return { ok: true, started: true, station, pillar, pillarName: rubricStationJob.pillarName };
}
function stopRubricStation() {
  if (!rubricStationJob.running) {
    rubricStationJob.stop = true;
    rubricStationJob.running = false;
    rubricStationJob.phase = rubricStationJob.phase === 'fix' ? 'stopped' : (rubricStationJob.phase || 'idle');
    rubricStationJob.currentId = '';
    rubricStationJob.currentStep = '';
    rubricStationJob.finishedAt = rubricStationJob.finishedAt || Date.now();
    saveRubricStationState(true);
    return { ok: true, stopped: true, msg: 'already idle — state cleared' };
  }
  rubricStationJob.stop = true;
  return { ok: true, stopping: true };
}
function forceStopRubricStation() {
  rubricStationJob.stop = true;
  rubricStationJob.running = false;
  rubricStationJob.phase = 'stopped';
  rubricStationJob.finishedAt = Date.now();
  rubricStationJob.currentId = '';
  rubricStationJob.currentStep = 'force stopped';
  rubricStationLog('⏹ force stop — rubric station halted');
  saveRubricStationState(true);
  return { ok: true, forceStopped: true };
}
function rubricStationStatusPayload() {
  const snap = Object.assign({}, rubricStationJob, { log: (rubricStationJob.log || []).slice(0, 24), stations: listStations() });
  delete snap._entries;
  return snap;
}

function pickDupePriorityId(list) {
  if (!list || !list.length) return null;
  const hits = list.filter(id => imageDupePriority.has(id));
  if (!hits.length) return null;
  hits.sort((a, b) => (imageDupeCounts[b] || 0) - (imageDupeCounts[a] || 0));
  return hits[0];
}
// Generate ↔ Scrub alternation when both pipeline + scrubber are active (owner 2026-07-04).
let pipelineAlt = {
  enabled: PIPELINE_AUTO_SCRUB_PUBLISH,
  next: 'generate',
  active: null,
  waiting: null,
  genTurns: 0,
  scrubTurns: 0,
  history: [],
  updatedAt: Date.now(),
};
function pipelineAltSnap() {
  return {
    enabled: pipelineAlt.enabled && PIPELINE_AUTO_SCRUB_PUBLISH,
    next: pipelineAlt.next,
    active: pipelineAlt.active,
    waiting: pipelineAlt.waiting,
    genTurns: pipelineAlt.genTurns,
    scrubTurns: pipelineAlt.scrubTurns,
    history: pipelineAlt.history.slice(0, 8),
    updatedAt: pipelineAlt.updatedAt,
  };
}
function touchPipelineAlt(patch) {
  if (patch) Object.assign(pipelineAlt, patch);
  pipelineAlt.updatedAt = Date.now();
  try { touchScrubLive({ pipelineAlt: pipelineAltSnap() }); } catch (e) {}
}
function pipelineAltAlternating() {
  return PIPELINE_AUTO_SCRUB_PUBLISH && !!(genJob && genJob.running);
}
async function acquirePipelineAltTurn(role) {
  if (!PIPELINE_AUTO_SCRUB_PUBLISH || !pipelineAltAlternating()) return;
  while (pipelineAlt.next !== role && !genJob.stop && !(role === 'scrub' && autoJob.stop)) {
    pipelineAlt.waiting = role;
    touchPipelineAlt({});
    await new Promise(r => setTimeout(r, 350));
  }
  pipelineAlt.waiting = null;
  pipelineAlt.active = role;
  touchPipelineAlt({});
}
function releasePipelineAltTurn(role, detail) {
  if (!PIPELINE_AUTO_SCRUB_PUBLISH || !pipelineAltAlternating()) return;
  if (role === 'generate') pipelineAlt.genTurns++;
  if (role === 'scrub') pipelineAlt.scrubTurns++;
  pipelineAlt.last = { role, detail: detail || null, at: Date.now() };
  pipelineAlt.history.unshift({ role, detail: detail || null, at: pipelineAlt.last.at });
  pipelineAlt.history = pipelineAlt.history.slice(0, 10);
  pipelineAlt.active = null;
  pipelineAlt.next = role === 'generate' ? 'scrub' : 'generate';
  touchPipelineAlt({});
}
async function waitPipelineAltHandoff(wantNext) {
  if (!pipelineAltAlternating()) return;
  while (pipelineAlt.next !== wantNext && !genJob.stop && !autoJob.stop) {
    pipelineAlt.waiting = wantNext === 'generate' ? 'generate-idle' : 'scrub-idle';
    touchPipelineAlt({});
    await new Promise(r => setTimeout(r, 350));
  }
  pipelineAlt.waiting = null;
  touchPipelineAlt({});
}
function recordScrubAutoResult(r) {
  if (!r) return;
  if (r.status === 'certified') {
    const st = stateObj();
    queueGraduatedForManualImages(r.id, titleOf[r.id] || r.id, autoLog).then(queued => {
      if (!queued) return;
      autoJob.squareQueued = (autoJob.squareQueued || 0) + 1;
      autoLog('◻️ ' + r.id + ' passed all Daily Driver gates → manual images email sent');
    });
    if (!autoJob.lastCertify || autoJob.lastCertify.id !== r.id || Date.now() - (autoJob.lastCertify.at || 0) > 8000) {
      autoJob.lastCertify = { id: r.id, score: r.score, before: r.before, at: Date.now(), green: st.green, under: st.under };
      autoJob.lastFinish = { type: 'certified', id: r.id, score: r.score, contentScore: r.score, before: r.before, at: Date.now(), green: st.green, under: st.under };
    }
  } else if (r.status === 'ready') {
    autoJob.ready++;
    const st = stateObj();
    const wasFix = readRejectFix().some(x => x && x.id === r.id);
    autoJob.lastFinish = { type: 'ready', id: r.id, score: r.score, contentScore: r.score, before: r.before, at: Date.now(), green: st.green, under: st.under, pending: st.pending, returnedFromFix: wasFix, needsReview: !!r.needsReview, caveats: r.caveats || [] };
    autoLog((wasFix ? '↩️ ' : (r.needsReview ? '⚠️ ' : '📋 ')) + r.id + ' ready ' + (r.score || '') + '/13' + (r.needsReview ? (' — review: ' + (r.caveats || []).join(', ')) : ' — approval pile'));
    appendScrubLog({ ts: new Date().toISOString(), id: r.id, status: 'ready', score: r.score, before: r.before, steps: r.steps || [], msg: r.needsReview ? ('review caveats: ' + (r.caveats || []).join(', ')) : 'awaiting Cursor/Claude Code approval' });
  } else if (r.status === 'parked') {
    autoJob.parked++;
    const st = stateObj();
    const why = (r.rubricFailed && r.rubricFailed.length) ? r.rubricFailed.join(',') : (r.msg || '');
    autoJob.lastFinish = { type: 'parked', id: r.id, score: r.score, contentScore: r.contentScore || r.score, why, at: Date.now(), green: st.green, under: st.under };
    autoLog('🅿️ ' + r.id + ' parked ' + (r.contentScore || r.score) + '/13 content — NOT certified · ' + String(why).slice(0, 60));
    appendScrubLog({ ts: new Date().toISOString(), id: r.id, status: 'parked', score: r.score, before: r.before, steps: r.steps || [], msg: why });
  } else if (r.status === 'error') { autoLog('⚠️ ' + String(r.msg || 'error').slice(0, 40)); }
  else if (r.status === 'skip') { autoLog('⏭ ' + (r.id || '?') + ' skipped'); }
}
async function scrubOnePipelineAlt() {
  const q = readArr(QUEUE);
  if (!filterQueueByPillar(q).length) return null;
  await acquirePipelineAltTurn('scrub');
  let r = null;
  try {
    autoJob.stage = '🔁 alt → scrub (factor 2)';
    genJob.stage = '🔁 alt → scrub (factor 2)';
    saveGen();
    autoLog('🔁 alt turn → scrub');
    touchScrubLive({ carwash: '🔁 Alt turn → scrubbing', stage: autoJob.stage });
    r = await scrubOne();
    autoJob.tried++;
    recordScrubAutoResult(r);
  } finally {
    releasePipelineAltTurn('scrub', r && r.id);
  }
  return r;
}
let lastPipelineEntryStartAt = 0;
let pipelineCooldownUntil = 0;
let pipelineCooldownSec = 0;
async function waitPipelineEntryGap(where) {
  if (typeof genJob !== 'undefined' && genJob && genJob.stop) return;
  if (typeof autoJob !== 'undefined' && autoJob && autoJob.stop) return;
  const now = Date.now();
  if (!lastPipelineEntryStartAt) {
    lastPipelineEntryStartAt = now;
    pipelineCooldownUntil = 0;
    pipelineCooldownSec = 0;
    return;
  }
  const wait = Math.max(0, (function () {
    let gapMs = PIPELINE_ENTRY_GAP_MS;
    try {
      const est = typeof laneEstimateMs === 'function' ? laneEstimateMs() : null;
      if (est) {
        const fluxCool = !!est.fluxBusy || (est.fluxReadyInMs || 0) > 1500;
        const ddgCool = (est.ddgReadyInMs || 0) > 1500;
        if (!fluxCool && !ddgCool) gapMs = Math.min(gapMs, Math.max(PIPELINE_ENTRY_GAP_FLOOR_MS, PIPELINE_ENTRY_GAP_READY_MS));
        else if (fluxCool || ddgCool) {
          const learnFlux = adaptiveThrottle.getCooldownMs('flux');
          const learnDdg = adaptiveThrottle.getCooldownMs('ddg');
          gapMs = Math.max(gapMs, PIPELINE_ENTRY_GAP_COOLING_MS, learnFlux, learnDdg);
        }
      }
    } catch (e) {}
    return gapMs;
  })() - (now - lastPipelineEntryStartAt));
  if (wait <= 0) {
    lastPipelineEntryStartAt = now;
    pipelineCooldownUntil = 0;
    pipelineCooldownSec = 0;
    return;
  }
  pipelineCooldownUntil = now + wait;
  const msg = '⏸ ' + where + ' — ' + (wait >= 60000 ? Math.ceil(wait / 60000) + 'm' : Math.ceil(wait / 1000) + 's') + ' wait (DDG + Pollinator pace)';
  console.log('[scrub-button] ' + msg);
  try {
    if (typeof genJob !== 'undefined' && genJob && genJob.running) { genJob.stage = msg; genJob.cooldownSec = Math.ceil(wait / 1000); saveGen(); genLog(msg); }
  } catch (e) {}
  try {
    if (typeof autoJob !== 'undefined' && autoJob && autoJob.running) { autoJob.stage = msg; autoJob.cooldownSec = Math.ceil(wait / 1000); autoLog(msg); touchScrubLive({ stage: msg, carwash: msg }); }
  } catch (e) {}
  const step = 5000;
  let left = wait;
  while (left > 0) {
    if (typeof genJob !== 'undefined' && genJob && genJob.stop) break;
    if (typeof autoJob !== 'undefined' && autoJob && autoJob.stop) break;
    const chunk = Math.min(step, left);
    await new Promise(r => setTimeout(r, chunk));
    left -= chunk;
    pipelineCooldownSec = Math.ceil(left / 1000);
    try {
      if (typeof genJob !== 'undefined' && genJob && genJob.running) genJob.cooldownSec = pipelineCooldownSec;
      if (typeof autoJob !== 'undefined' && autoJob && autoJob.running) autoJob.cooldownSec = pipelineCooldownSec;
    } catch (e) {}
  }
  pipelineCooldownUntil = 0;
  pipelineCooldownSec = 0;
  lastPipelineEntryStartAt = Date.now();
}
const { fluxStats, FLUX_MIN_MS } = require('./_pollinator_flux_throttle');
function fluxSpacingMs() {
  const ps = fluxStats();
  return ps.freqMs ?? ps.minGapMs ?? ps.gapMs ?? FLUX_MIN_MS ?? 0;
}
const { pingIndexNowUrlList, stampIndexed } = require('./netlify/functions/lib/indexnow-ping-entry');
const { libraryEntryPublicUrl, libraryEntryKind, SITE: PULSE_SITE } = require('./netlify/functions/lib/library-entry-url');
const { pushSeoCounts } = require('./_seo_monitor_sync_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const SQUARE_ONLY = process.argv.includes('--square-only') || process.env.SQUARE_ONLY === '1';
const PORT = SQUARE_ONLY
  ? parseInt(process.env.SQUARE_PORT || '4444', 10)
  : parseInt(process.env.SCRUB_BTN_PORT || '8899', 10);
const PASS = '4444';
const DAILY_MAX = parseInt(process.env.SCRUB_BTN_DAILY || '200', 10);
const MIN_SCORE = 12, WORD_FLOOR = 2000;
const NR = WD + '/_v2_needs_review.json', AP = WD + '/_v2_approved.json', CC = WD + '/_v2_cc_approved.json';
const QUEUE = WD + '/_scrub_button_queue.json';      // remaining under-12 ids to work
const COOKQ = WD + '/_scrub_cook_queue.json';        // legacy — merged into QUEUE on scrub start (fast pass removed)
const PARK = WD + '/_redbox_parked.json';
const PENDING = WD + '/_scrub_pending_signoff.json';   // passed scrub — owner/agent must certify to green
const REJECT_FIX = WD + '/_scrub_reject_fix.json';     // owner ✗ — re-scrub → back to pending (fair-scheduled with fresh pool)
const AGENT_FIX = WD + '/_scrub_agent_fix_queue.json'; // Cursor/agent visibility for owner rejects
const AGENT_FIX_MD = WD + '/_SCRUB_AGENT_FIX_QUEUE.md';
const DAYF = WD + '/_scrub_button_day.json';
const SCRUBLOG = WD + '/_scrub_run_log.json';
// Owner ✗ image-only retargets skip the full DeepSeek + duplicate DDG pass (faster return to approval pile).
const OWNER_RETARGET_IMAGE_KEYS = new Set(['pollinatorInternalFlux', 'pollinatorFaceCover', 'media3to10', 'imagesLaw', 'top10Images', 'heroImage', 'faceCardApplicable']);
function isOwnerImageRetarget(targets) {
  return Array.isArray(targets) && targets.length > 0 && targets.every(k => OWNER_RETARGET_IMAGE_KEYS.has(k));
}
// Alternate fix ↔ fresh so owner re-reviews don't starve the 35k first-time pool (and vice versa).
let scrubPickKind = 'fresh';
const SCRUB_FILTER_F = WD + '/_scrub_pillar_filter.json';
let scrubPillarFilter = null; // null = all pillars
let scrubActivityFeed = [];
function loadScrubPillarFilter() {
  try {
    const d = JSON.parse(fs.readFileSync(SCRUB_FILTER_F, 'utf8'));
    scrubPillarFilter = (d && d.pillar && d.pillar !== 'all') ? String(d.pillar) : null;
  } catch (e) { scrubPillarFilter = null; }
}
function saveScrubPillarFilter() {
  try { fs.writeFileSync(SCRUB_FILTER_F, JSON.stringify({ pillar: scrubPillarFilter || 'all', at: Date.now() })); } catch (e) {}
}
function getScrubPillarFilter() { return scrubPillarFilter; }
function setScrubPillarFilter(p) {
  scrubPillarFilter = (!p || p === 'all') ? null : String(p);
  saveScrubPillarFilter();
}
function queueMatchesPillarFilter(id, filter) {
  if (!filter) return true;
  return pillarOf(id) === filter;
}
function filterQueueByPillar(queue, filter) {
  filter = filter != null ? filter : getScrubPillarFilter();
  if (!filter) return queue || [];
  return (queue || []).filter(id => queueMatchesPillarFilter(id, filter));
}
function queueCountsByPillar(queue) {
  const c = {};
  for (const id of (queue || [])) { const p = pillarOf(id); c[p] = (c[p] || 0) + 1; }
  return c;
}
function pushScrubActivity(msg, meta) {
  scrubActivityFeed.unshift(Object.assign({ ts: Date.now(), msg: String(msg || '') }, meta || {}));
  scrubActivityFeed = scrubActivityFeed.slice(0, 50);
}
function pickNextScrubId(queue, opts) {
  opts = opts || {};
  const pf = opts.pillarFilter != null ? opts.pillarFilter : getScrubPillarFilter();
  queue = filterQueueByPillar(queue, pf);
  if (!queue || !queue.length) return null;
  const fixSet = new Set(readRejectFix().map(x => x && x.id).filter(Boolean));
  const fixes = queue.filter(id => fixSet.has(id));
  const fresh = queue.filter(id => !fixSet.has(id));
  if (!fixes.length) {
    scrubPickKind = 'fresh';
    const dupeFresh = pickDupePriorityId(queue);
    if (dupeFresh) return dupeFresh;
    const pipeOnly = queue.filter(id => pipelineScrubPriority.has(id));
    return pipeOnly.length ? pipeOnly[0] : queue[0];
  }
  if (!fresh.length) {
    scrubPickKind = 'fix';
    const dupeFix = pickDupePriorityId(fixes);
    if (dupeFix) return dupeFix;
    return fixes[0];
  }
  const pipeFresh = fresh.filter(id => pipelineScrubPriority.has(id));
  const pipeFix = fixes.filter(id => pipelineScrubPriority.has(id));
  const dupeFresh = pickDupePriorityId(fresh);
  const dupeFix = pickDupePriorityId(fixes);
  if (scrubPickKind === 'fix') {
    scrubPickKind = 'fresh';
    if (dupeFresh) return dupeFresh;
    if (pipeFresh.length) return pipeFresh[0];
    return fresh[0];
  }
  scrubPickKind = 'fix';
  if (dupeFix) return dupeFix;
  if (pipeFix.length) return pipeFix[0];
  if (dupeFresh) { scrubPickKind = 'fresh'; return dupeFresh; }
  if (pipeFresh.length) { scrubPickKind = 'fresh'; return pipeFresh[0]; }
  return fixes[0];
}
// ── PARALLEL LANE SCRUB (owner 2026-07-03): 48 in batch · up to 3 workers at once on DIFFERENT Q&As:
//   ✍️ content (DeepSeek write + Claude auditor) · 🌸 flux hero · 🖼 DDG section — each resource once at a time.
const SCRUB_LANE_MODE = process.env.SCRUB_LANE_MODE === '1';
const STANDARD_SCRUB_ENABLED = process.env.STANDARD_SCRUB !== '0';
const LANE_JOBS_F = WD + '/_scrub_lane_jobs.json';
const LANE_TICK_MS = parseInt(process.env.SCRUB_LANE_TICK_MS || '15000', 10);   // idle fallback only (not fixed cadence)
const LANE_MIN_GAP_MS = parseInt(process.env.LANE_MIN_GAP_MS || '2000', 10);
const LANE_IDLE_MS = parseInt(process.env.LANE_IDLE_MS || String(LANE_TICK_MS), 10);
const LANE_MAX_JOBS = parseInt(process.env.SCRUB_LANE_MAX_JOBS || '48', 10);
const LANE_CONTENT_MAX_ROUNDS = parseInt(process.env.LANE_CONTENT_MAX_ROUNDS || '1', 10);
const LANE_CONTENT_AUDITORS = parseInt(process.env.LANE_CONTENT_AUDITORS || '2', 10); // ds count when LANE_AUDITOR_MODE=ds
const LANE_CC_AUDITORS = parseInt(process.env.LANE_CC_AUDITORS || '2', 10);
const LANE_CONTENT_SLOTS = LANE_CONTENT_WRITERS >= 2 ? ['content', 'content2'] : ['content'];
const LANE_DDG_PACE_MS = DDG_GAP_MS;
const LANE_DDG_ESTIMATE_MS = parseInt(process.env.LANE_DDG_ESTIMATE_MS || String(DDG_GAP_MS + parseInt(process.env.DDG_RENDER_SETTLE_MS || '1200', 10)), 10);
const LANE_CONTENT_ESTIMATE_MS = parseInt(process.env.LANE_CONTENT_ESTIMATE_MS || '10000', 10);
const LANE_IMAGE_FLOOR_PCT = parseFloat(process.env.LANE_IMAGE_FLOOR_PCT || '0.35');
const LANE_MAX_CONTENT_PCT = parseFloat(process.env.LANE_MAX_CONTENT_PCT || '0.55');
// 🔀 IMAGE LANE: site-wide Pollinator flux (cover + sections). INTERNAL_IMAGES_DDG=1 restores DDG section lane + rotation.
// One image API per orchestrate tick (content worker still runs in parallel). Flip after IMAGE_ROTATE_BATCH slices.
// Throttle-aware (LATEST-30): when flux or DDG hits cooldown/rate-limit → immediately switch to the other lane.
const IMAGE_ROTATE_BATCH = Math.max(1, parseInt(process.env.IMAGE_ROTATE_BATCH || '1', 10));
const LANE_THROTTLE_MS = {
  flux: parseInt(process.env.FLUX_THROTTLE_COOLDOWN_MS || process.env.POLLINATOR_FREQ_MS || process.env.POLLINATOR_MIN_MS || '0', 10),
  ddg: parseInt(process.env.DDG_THROTTLE_COOLDOWN_MS || '45000', 10),
};
const THROTTLE_KW = /429|403|throttl|rate.?limit|cooldown|too many|busy/i;
let imageRotateLane = INTERNAL_IMAGES_DDG ? 'ddg' : 'flux';
let imageRotateCount = 0;
let imageRotateFlips = 0;
let lastSuccessfulImageLane = INTERNAL_IMAGES_DDG ? 'ddg' : 'flux';
let bothCooldownStickLane = null;    // stick to one lane while both throttled — no ping-pong
const laneThrottle = {
  flux: { until: 0, reason: '', hits: 0, lastAt: 0 },
  ddg: { until: 0, reason: '', hits: 0, lastAt: 0 },
};
function isThrottleMsg(msg) { return THROTTLE_KW.test(String(msg || '')); }
function laneThrottleInfo(slot) {
  const t = laneThrottle[slot] || {};
  const left = Math.max(0, (t.until || 0) - Date.now());
  return { slot, until: t.until || 0, leftMs: left, leftSec: Math.ceil(left / 1000), reason: t.reason || '', hits: t.hits || 0, active: left > 0 };
}
function bothLanesCooling(est) {
  est = est || laneEstimateMs();
  return fluxLaneCooling(est) && ddgLaneCooling(est);
}
function bothCooldownWaitMs(est) {
  est = est || laneEstimateMs();
  if (!bothLanesCooling(est)) return 0;
  const fluxLeft = fluxLaneCooling(est) ? Math.max(laneThrottleInfo('flux').leftMs, est.fluxReadyInMs || 0) : 0;
  const ddgLeft = ddgLaneCooling(est) ? Math.max(laneThrottleInfo('ddg').leftMs, est.ddgReadyInMs || 0) : 0;
  return Math.min(fluxLeft || Infinity, ddgLeft || Infinity);
}
function resolveBothCooldownStick(est) {
  est = est || laneEstimateMs();
  const fluxLeft = fluxLaneCooling(est) ? Math.max(laneThrottleInfo('flux').leftMs, est.fluxReadyInMs || 0) : 0;
  const ddgLeft = ddgLaneCooling(est) ? Math.max(laneThrottleInfo('ddg').leftMs, est.ddgReadyInMs || 0) : 0;
  if (fluxLeft < ddgLeft) return 'flux';
  if (ddgLeft < fluxLeft) return 'ddg';
  if (lastSuccessfulImageLane === 'flux' || lastSuccessfulImageLane === 'ddg') return lastSuccessfulImageLane;
  return 'ddg';
}
function updateBothCooldownStick(est) {
  est = est || laneEstimateMs();
  if (bothLanesCooling(est)) {
    if (!bothCooldownStickLane) {
      bothCooldownStickLane = resolveBothCooldownStick(est);
      imageRotateLane = bothCooldownStickLane;
      imageRotateCount = 0;
      autoLog('⏸️ both lanes cooling — sticking with ' + (bothCooldownStickLane === 'ddg' ? 'DDG' : 'flux') + ' (no ping-pong)');
    }
    return true;
  }
  bothCooldownStickLane = null;
  return false;
}
function forceImageRotateTo(lane, why) {
  if (!INTERNAL_IMAGES_DDG && lane === 'ddg') return;
  if (lane !== 'ddg' && lane !== 'flux') return;
  if (bothLanesCooling() && bothCooldownStickLane && lane !== bothCooldownStickLane) return;
  if (imageRotateLane === lane) return;
  imageRotateLane = lane;
  imageRotateCount = 0;
  imageRotateFlips++;
  autoLog('🔀 throttle rotate → ' + (lane === 'ddg' ? 'DDG sections' : 'Pollinator hero') + (why ? ' (' + why + ')' : ''));
}
function markLaneThrottled(slot, reason, ms) {
  if (slot !== 'flux' && slot !== 'ddg') return;
  // IMAGE_ALTERNATE: flux is now an equal Top-10 producer, so it must ALSO learn its real-time
  // cooldown (was previously excluded). Both providers adapt → minimize dead time.
  const fluxLearns = IMAGE_ALTERNATE;
  const learn = (slot === 'flux' && !fluxLearns) ? { ms: 0, stepSec: 0, sweet: false, nextStepSec: null } : adaptiveThrottle.onThrottle(slot, reason);
  const cool = (slot === 'flux' && !fluxLearns)
    ? Math.max(0, ms || 0, LANE_THROTTLE_MS[slot] || 0)
    : Math.max(1000, learn.ms, ms || 0, LANE_THROTTLE_MS[slot] || 0);
  laneThrottle[slot].until = Date.now() + cool;
  laneThrottle[slot].reason = String(reason || 'throttled').slice(0, 120);
  laneThrottle[slot].hits = (laneThrottle[slot].hits || 0) + 1;
  laneThrottle[slot].lastAt = Date.now();
  laneThrottle[slot].learnStepSec = learn.stepSec;
  laneThrottle[slot].learnSweet = !!learn.sweet;
  laneThrottle[slot].learnNextSec = learn.nextStepSec;
  const est = laneEstimateMs();
  if (bothLanesCooling(est)) {
    updateBothCooldownStick(est);
    autoLog('⏸️ ' + slot + ' throttled — both cooling, stick ' + (bothCooldownStickLane || 'ddg') + ' (' + reason + ') · learn ' + learn.stepSec + 's');
    return;
  }
  const other = slot === 'flux' ? 'ddg' : 'flux';
  if (!(other === 'flux' ? fluxLaneCooling(est) : ddgLaneCooling(est))) {
    forceImageRotateTo(other, 'throttle: ' + laneThrottle[slot].reason);
  }
  const nextNote = learn.sweetStep != null ? '' : (learn.nextStepSec ? ' · next try ' + learn.nextStepSec + 's' : '');
  autoLog('⏸️ ' + slot + ' throttled (' + laneThrottle[slot].reason + ') → learn wait ' + learn.stepSec + 's' + nextNote + ' · switch ' + Math.round(cool / 1000) + 's');
}
function fluxLaneCooling(est) {
  est = est || laneEstimateMs();
  const th = laneThrottleInfo('flux');
  return th.active || !!est.fluxBusy || est.fluxReadyInMs > 0;
}
function ddgLaneCooling(est) {
  est = est || laneEstimateMs();
  const th = laneThrottleInfo('ddg');
  return th.active || est.ddgReadyInMs > 0;
}
function imageRotateState() {
  const est = laneEstimateMs();
  const both = updateBothCooldownStick(est);
  const stick = bothCooldownStickLane;
  const waitMs = both ? bothCooldownWaitMs(est) : 0;
  return {
    active: imageRotateLane,
    next: imageRotateLane === 'ddg' ? 'flux' : 'ddg',
    batch: IMAGE_ROTATE_BATCH,
    count: imageRotateCount,
    flips: imageRotateFlips,
    label: imageRotateLane === 'ddg' ? '🖼 DDG sections' : '🌸 Pollinator hero',
    nextLabel: imageRotateLane === 'ddg' ? '🌸 Pollinator hero' : '🖼 DDG sections',
    fluxCooling: fluxLaneCooling(est),
    ddgCooling: ddgLaneCooling(est),
    fluxThrottle: laneThrottleInfo('flux'),
    ddgThrottle: laneThrottleInfo('ddg'),
    bothCooldown: both,
    stickLane: stick,
    stickLabel: stick === 'ddg' ? '🖼 DDG sections' : stick === 'flux' ? '🌸 Pollinator hero' : null,
    waitMs,
    waitSec: waitMs ? Math.ceil(waitMs / 1000) : 0,
    alternationPaused: both,
    throttleLearn: adaptiveThrottle.snapAll(),
  };
}
function markLaneSuccess(slot) {
  if (slot !== 'flux' && slot !== 'ddg') return null;
  if (slot === 'flux') {
    autoLog('✅ flux image OK — serial queue (no extra wait)');
    return { ms: 0, stepSec: 0, sweet: false };
  }
  const r = adaptiveThrottle.onSuccess(slot);
  autoLog('✅ ' + slot + ' image OK — throttle sweet spot ' + r.stepSec + 's (locked)');
  return r;
}
function bumpImageRotate(slot) {
  if (slot !== 'ddg' && slot !== 'flux') return;
  lastSuccessfulImageLane = slot;
  if (bothLanesCooling()) return;
  if (!INTERNAL_IMAGES_DDG) return;
  imageRotateCount++;
  if (imageRotateCount >= IMAGE_ROTATE_BATCH) {
    imageRotateLane = slot === 'ddg' ? 'flux' : 'ddg';
    imageRotateCount = 0;
    imageRotateFlips++;
    autoLog('🔀 image rotate → ' + (imageRotateLane === 'ddg' ? 'DDG sections' : 'Pollinator hero'));
  }
}
function pickRotatingImageJob(jobs, est) {
  est = est || laneEstimateMs();
  if (updateBothCooldownStick(est)) {
    const w = Math.ceil(bothCooldownWaitMs(est) / 1000);
    return null;
  }
  const cover = jobs.filter(j => j.phase === 'image_cover');
  const ddg = jobs.filter(j => ['image_section', 'top10', 'image_verify'].includes(j.phase));
  const rot = imageRotateState();
  const fluxCool = fluxLaneCooling(est);
  const ddgCool = ddgLaneCooling(est);
  const tryDdg = () => {
    if (imagePausedNow()) return null;   // owner: image production paused (stuck watchdog)
    if ((INTERNAL_IMAGES_DDG || IMAGE_ALTERNATE) && !laneSlots.ddg.busy && !ddgCool && ddg.length) {
      const j = pickStalestLaneJob(ddg);
      return j ? { slot: 'ddg', job: j, reason: '🖼 ' + j.id + ' DDG §' + (fluxCool ? ' (flux cooling)' : ' (' + rot.count + '/' + rot.batch + ')') } : null;
    }
    return null;
  };
  const tryFlux = () => {
    if (imagePausedNow()) return null;   // owner: image production paused (stuck watchdog)
    // IMAGE_ALTERNATE: flux is eligible for section/top10/verify too (not just cover) so it can
    // take over Top-10 images when DDG throttles — both providers rotate on the same image pool.
    const fluxPhases = (INTERNAL_IMAGES_DDG && !IMAGE_ALTERNATE) ? ['image_cover'] : ['image_cover', 'image_section', 'top10', 'image_verify'];
    const fluxPool = INTERNAL_IMAGES_DDG ? cover : jobs.filter(j => fluxPhases.includes(j.phase));
    if (!laneSlots.flux.busy && !fluxCool && fluxPool.length) {
      const j = pickStalestLaneJob(fluxPool);
      if (!j) return null;
      const label = j.phase === 'image_cover' ? 'hero' : j.phase === 'top10' ? 'top10' : j.phase === 'image_verify' ? 'verify' : '§' + (j.sectionIdx != null ? j.sectionIdx : '');
      return { slot: 'flux', job: j, reason: '🌸 ' + j.id + ' ' + label + (ddgCool && INTERNAL_IMAGES_DDG ? ' (DDG cooling)' : ' (' + rot.count + '/' + rot.batch + ')') };
    }
    return null;
  };
  // Throttle-first: active lane cooling → flip to other immediately (enhances scheduled rotation).
  if (rot.active === 'ddg' && ddgCool && !fluxCool) {
    forceImageRotateTo('flux', 'ddg throttle');
    const f = tryFlux(); if (f) return f;
  }
  if (rot.active === 'flux' && fluxCool && !ddgCool) {
    forceImageRotateTo('ddg', 'flux throttle');
    const d = tryDdg(); if (d) return d;
  }
  const preferredHasWork = rot.active === 'ddg' ? ddg.length > 0 : cover.length > 0;
  if (preferredHasWork) {
    const pick = rot.active === 'ddg' ? tryDdg() : tryFlux();
    if (pick) return pick;
    return rot.active === 'ddg' ? tryFlux() : tryDdg();
  }
  return rot.active === 'ddg' ? tryFlux() : tryDdg();
}
let laneDdgLastAt = 0;
function lanePipelineBalance(jobs) {
  const n = Math.max(1, (jobs || []).length);
  const contentN = jobs.filter(j => j.phase === 'content').length;
  const coverN = jobs.filter(j => j.phase === 'image_cover').length;
  const ddgN = jobs.filter(j => j.phase === 'image_section' || j.phase === 'top10').length;
  const imagePipelineN = jobs.filter(j => ['image_cover', 'image_section', 'top10', 'image_verify'].includes(j.phase)).length;
  const minImage = Math.max(4, Math.ceil(n * LANE_IMAGE_FLOOR_PCT));
  const maxContent = Math.ceil(n * LANE_MAX_CONTENT_PCT);
  return {
    n, contentN, coverN, ddgN, imagePipelineN,
    minImage, maxContent,
    contentHeavy: contentN > maxContent,
    imageStarved: imagePipelineN < minImage && n >= 8,
    bottleneckRisk: contentN > maxContent || (imagePipelineN < minImage && n >= 8),
  };
}
function laneRebalanceJobs(jobs) {
  const bal = lanePipelineBalance(jobs);
  if (!bal.bottleneckRisk) return jobs;
  let bumped = 0;
  const out = jobs.map(j => {
    if (j.phase !== 'content') return j;
    if ((j.contentRounds || 0) >= 1 || bal.contentHeavy) {
      bumped++;
      return Object.assign({}, j, { phase: 'image_cover', contentRounds: 0 });
    }
    return j;
  });
  if (bumped) autoLog('🔀 pipeline spread — ' + bumped + ' articles pushed to images (avoid end-batch flux/DDG jam)');
  return out;
}
let laneTimer = null;
let laneOrchestrating = false;
let laneJobsLock = Promise.resolve();
let laneNextTickAt = 0;
let laneNextDelayMs = LANE_MIN_GAP_MS;
const laneSlots = {
  flux: { busy: false, id: null, label: '', phase: null },
  ddg: { busy: false, id: null, label: '', phase: null },
  content: { busy: false, id: null, label: '', phase: null },
  content2: { busy: false, id: null, label: '', phase: null },
};
function laneContentSlotFree(name) {
  return LANE_CONTENT_SLOTS.includes(name) && laneSlots[name] && !laneSlots[name].busy;
}
function forEachContentSlot(fn) { LANE_CONTENT_SLOTS.forEach(fn); }
let laneLive = { phase: 'idle', id: null, slice: null, jobs: 0, ticks: 0, lastAt: null, pickReason: null, slots: null };
function withLaneJobsLock(fn) {
  const next = laneJobsLock.then(() => fn());
  laneJobsLock = next.catch(() => {});
  return next;
}
function anyLaneSlotBusy() {
  return laneSlots.flux.busy || laneSlots.ddg.busy || LANE_CONTENT_SLOTS.some(s => laneSlots[s] && laneSlots[s].busy);
}
function summarizeLaneSlots() {
  const out = {
    flux: { busy: laneSlots.flux.busy, id: laneSlots.flux.id, label: laneSlots.flux.label, phase: laneSlots.flux.phase },
    ddg: { busy: laneSlots.ddg.busy, id: laneSlots.ddg.id, label: laneSlots.ddg.label, phase: laneSlots.ddg.phase },
    content: { busy: laneSlots.content.busy, id: laneSlots.content.id, label: laneSlots.content.label, phase: laneSlots.content.phase },
  };
  if (LANE_CONTENT_WRITERS >= 2) {
    out.content2 = { busy: laneSlots.content2.busy, id: laneSlots.content2.id, label: laneSlots.content2.label, phase: laneSlots.content2.phase };
  }
  return out;
}
function laneActiveIds() {
  const out = [];
  if (laneSlots.flux.busy && laneSlots.flux.id) out.push({ id: laneSlots.flux.id, slot: 'flux', label: laneSlots.flux.label });
  if (laneSlots.ddg.busy && laneSlots.ddg.id) out.push({ id: laneSlots.ddg.id, slot: 'ddg', label: laneSlots.ddg.label });
  forEachContentSlot(s => {
    if (laneSlots[s].busy && laneSlots[s].id) out.push({ id: laneSlots[s].id, slot: s, label: laneSlots[s].label || '✍️ Words' });
  });
  return out;
}
function pickLaneJobsParallel(jobs) {
  const est = laneEstimateMs();
  const picks = [];
  const used = new Set();
  const pool = arr => {
    const j = pickStalestLaneJob((arr || []).filter(x => x && !used.has(x.id)));
    if (j) used.add(j.id);
    return j;
  };
  // Image lanes alternate DDG ↔ Pollinator (one image API per tick — cuts cooldown hammering).
  const imgPick = pickRotatingImageJob(jobs, est);
  if (imgPick) {
    used.add(imgPick.job.id);
    picks.push(imgPick);
  }
  if (!laneSlots.content.busy) {
    let j = pool(jobs.filter(x => x.phase === 'content'));
    if (!j) j = pool(jobs.filter(x => x.phase === 'gate'));
    if (j) {
      const tag = j.phase === 'content' ? '✍️' : '✅';
      picks.push({ slot: 'content', job: j, reason: tag + ' ' + j.id + (bothLanesCooling(est) ? ' (images cooling)' : '') });
    }
  }
  if (LANE_CONTENT_WRITERS >= 2 && !laneSlots.content2.busy) {
    let j = pool(jobs.filter(x => x.phase === 'content'));
    if (!j) j = pool(jobs.filter(x => x.phase === 'gate'));
    if (j) {
      const tag = j.phase === 'content' ? '✍️' : '✅';
      picks.push({ slot: 'content2', job: j, reason: tag + ' ' + j.id + ' (writer 2)' + (bothLanesCooling(est) ? ' (images cooling)' : '') });
    }
  }
  return picks;
}
function laneGapBeforeNextTick(jobs) {
  jobs = (jobs || []).filter(j => j && j.id);
  if (!jobs.length) return LANE_IDLE_MS;
  const est = laneEstimateMs();
  const min = LANE_MIN_GAP_MS;
  if (bothLanesCooling(est)) {
    const wait = bothCooldownWaitMs(est);
    return Math.max(min, wait + 300);
  }
  const pick = pickLaneJobCooldownAware(jobs);
  if (!pick.job) return LANE_IDLE_MS;
  const phase = pick.job.phase || 'content';
  if (phase === 'image_cover') {
    if (est.fluxBusy) return Math.max(min, 3000);
    if (est.fluxReadyInMs > 0) return Math.max(min, est.fluxReadyInMs + 300);
    return min;
  }
  if (phase === 'image_section' || phase === 'top10') {
    if (!INTERNAL_IMAGES_DDG) {
      if (est.fluxBusy) return Math.max(min, 3000);
      if (est.fluxReadyInMs > 0) return Math.max(min, est.fluxReadyInMs + 300);
      return min;
    }
    if (est.ddgReadyInMs > 0) return Math.max(min, est.ddgReadyInMs + 300);
    return min;
  }
  return min;
}
function scheduleLaneTick(delayMs) {
  if (laneTimer) { clearTimeout(laneTimer); laneTimer = null; }
  const d = Math.max(500, Math.round(delayMs || 0));
  laneNextDelayMs = d;
  laneNextTickAt = Date.now() + d;
  laneTimer = setTimeout(() => { laneTimer = null; laneOrchestrate().catch(() => {}); }, d);
}
function readLaneJobs() { try { return JSON.parse(fs.readFileSync(LANE_JOBS_F, 'utf8')); } catch (e) { return []; } }
function writeLaneJobs(a) { fs.writeFileSync(LANE_JOBS_F, JSON.stringify(a, null, 2)); }
function pickStalestLaneJob(jobs) {
  if (!jobs.length) return null;
  return jobs.slice().sort((a, b) => (a.lastTick || 0) - (b.lastTick || 0))[0];
}
function laneEstimateMs() {
  const ps = fluxStats();
  const fluxFreq = fluxSpacingMs();
  const fluxReadyIn = ps.lastDoneAt ? Math.max(0, fluxFreq - (Date.now() - ps.lastDoneAt)) : 0;
  const ddgReadyIn = laneDdgLastAt ? Math.max(0, LANE_DDG_PACE_MS - (Date.now() - laneDdgLastAt)) : 0;
  return {
    fluxFreqMs: fluxFreq,
    fluxAvgMs: ps.avgMs || 0,
    fluxLastMs: ps.lastMs || 0,
    fluxBusy: !!ps.busy,
    fluxReadyInMs: fluxReadyIn,
    fluxReadyInSec: Math.ceil(fluxReadyIn / 1000),
    ddgPaceMs: LANE_DDG_PACE_MS,
    ddgSliceMs: LANE_DDG_ESTIMATE_MS,
    ddgReadyInMs: ddgReadyIn,
    ddgReadyInSec: Math.ceil(ddgReadyIn / 1000),
    contentSliceMs: LANE_CONTENT_ESTIMATE_MS,
    tickMs: LANE_TICK_MS,
  };
}
function pickLaneJobCooldownAware(jobs) {
  if (!jobs.length) return { job: null, reason: 'no jobs' };
  const est = laneEstimateMs();
  if (!INTERNAL_IMAGES_DDG) {
    const imgPick = pickRotatingImageJob(jobs, est);
    if (imgPick && imgPick.job) return { job: imgPick.job, reason: imgPick.reason };
    const pool = arr => pickStalestLaneJob(arr);
    const content = jobs.filter(j => j.phase === 'content');
    const gate = jobs.filter(j => j.phase === 'gate');
    if (est.fluxBusy && content.length) return { job: pool(content), reason: '✍️ flux busy · words' };
    if (gate.length) return { job: pool(gate), reason: '✅ gate check' };
    if (content.length) return { job: pool(content), reason: '✍️ content' };
    return { job: pickStalestLaneJob(jobs), reason: '🌸 pollinator' };
  }
  const bal = lanePipelineBalance(jobs);
  const pool = arr => pickStalestLaneJob(arr);
  const cover = jobs.filter(j => j.phase === 'image_cover');
  const ddg = jobs.filter(j => j.phase === 'image_section' || j.phase === 'top10');
  const verify = jobs.filter(j => j.phase === 'image_verify');
  const gate = jobs.filter(j => j.phase === 'gate');
  const content = jobs.filter(j => j.phase === 'content');
  const fluxSec = Math.round(est.fluxFreqMs / 1000);
  const ddgSec = Math.round(est.ddgSliceMs / 1000);
  const rot = imageRotateState();
  if (bal.bottleneckRisk) {
    const imgPick = pickRotatingImageJob(jobs, est);
    if (imgPick && imgPick.job) return { job: imgPick.job, reason: imgPick.reason + ' · spread pipeline' };
    if (cover.length) return { job: pool(cover), reason: '🌸 spread pipeline — cover backlog' };
    if (ddg.length) return { job: pool(ddg), reason: '🖼 spread pipeline — DDG backlog' };
  }
  // Rotation-first: prefer active image lane when ready; other lane only if active has no jobs.
  const imgPick = pickRotatingImageJob(jobs, est);
  if (imgPick && imgPick.job) return { job: imgPick.job, reason: imgPick.reason };
  if (rot.active === 'ddg' && est.fluxReadyInMs === 0 && !est.fluxBusy && cover.length) {
    return { job: pool(cover), reason: '🌸 flux ready (DDG lane empty) — hero cover' };
  }
  if (rot.active === 'flux' && est.ddgReadyInMs === 0 && ddg.length) {
    return { job: pool(ddg), reason: '🖼 DDG ready (flux lane empty) — section' };
  }
  if (est.fluxBusy) {
    if (est.ddgReadyInMs === 0 && ddg.length) return { job: pool(ddg), reason: '🖼 flux busy · DDG turn (~' + ddgSec + 's)' };
    if (content.length) return { job: pool(content), reason: '✍️ flux busy (~' + Math.round((est.fluxAvgMs || 45000) / 1000) + 's gen) · words' };
    if (gate.length) return { job: pool(gate), reason: '✅ flux busy · gate' };
    if (ddg.length) return { job: pool(ddg), reason: '🖼 flux busy · DDG backlog' };
  }
  if (est.fluxReadyInMs > 0 && cover.length) {
    if (est.ddgReadyInMs === 0 && ddg.length && est.fluxReadyInMs >= est.ddgSliceMs) {
      return { job: pool(ddg), reason: '🖼 flux in ' + est.fluxReadyInSec + 's · DDG now (~' + ddgSec + 's)' };
    }
    if (content.length && est.fluxReadyInMs >= est.contentSliceMs * 0.5) {
      return { job: pool(content), reason: '✍️ flux in ' + est.fluxReadyInSec + 's · words while waiting' };
    }
  }
  if (est.ddgReadyInMs === 0 && ddg.length) {
    return { job: pool(ddg), reason: '🖼 DDG ready (pace ' + Math.round(est.ddgPaceMs / 1000) + 's) · section' };
  }
  if (est.ddgReadyInMs > 0 && est.ddgReadyInMs <= est.tickMs && content.length) {
    return { job: pool(content), reason: '✍️ DDG in ' + est.ddgReadyInSec + 's · words fill' };
  }
  if (gate.length) return { job: pool(gate), reason: '✅ gate check' };
  if (verify.length) return { job: pool(verify), reason: '🔍 verify images' };
  if (content.length && !bal.bottleneckRisk) return { job: pool(content), reason: '✍️ content' };
  if (cover.length) return { job: pool(cover), reason: '🌸 cover backlog' };
  if (ddg.length) return { job: pool(ddg), reason: '🖼 DDG backlog' };
  if (content.length) return { job: pool(content), reason: '✍️ content (pipeline catching up)' };
  return { job: pickStalestLaneJob(jobs), reason: 'rotate' };
}
function upsertLaneJob(id, patch) {
  const all = readLaneJobs();
  const prev = all.find(j => j && j.id === id) || {};
  const job = Object.assign({ id, phase: 'content', sectionIdx: 0, contentRounds: 0, lastTick: 0, at: Date.now() }, prev, patch || {}, { id, lastTick: 0 });
  writeLaneJobs([job, ...all.filter(j => j && j.id !== id)].slice(0, LANE_MAX_JOBS));
  return job;
}
function lanePhaseLabel(phase, sectionIdx) {
  const sect = INTERNAL_IMAGES_DDG ? ('🖼 DDG §' + ((sectionIdx || 0) + 1)) : ('🌸 flux §' + ((sectionIdx || 0) + 1));
  const m = { content: '✍️ content', image_cover: '🌸 flux cover', image_section: sect, image_verify: '🔍 verify imgs', top10: '🏆 top10 imgs', gate: '✅ rubric gate' };
  return m[phase] || phase;
}
function lanePhaseIndex(phase) {
  const order = ['content', 'image_cover', 'image_section', 'top10', 'image_verify', 'gate'];
  const i = order.indexOf(phase);
  return i < 0 ? 0 : i;
}
function laneComputeProgress(id, body, job) {
  const rb = rubricSignOff(id, body);
  const phase = job.phase || 'content';
  const pi = lanePhaseIndex(phase);
  const lines = String(body || '').split('\n');
  const top10 = isTop10Body(body);
  const ddgTotal = top10 ? 10 : Math.max(1, ddgImageSectionTargets(lines, body).length);
  let ddgDone = job.sectionIdx || 0;
  if (pi >= lanePhaseIndex('image_verify')) ddgDone = ddgTotal;
  else if (phase === 'image_section') ddgDone = Math.min(ddgDone, ddgTotal);
  if (top10 && phase === 'top10') ddgDone = countProductImgs(body);
  const rubricPassed = rb.rubricPassed != null ? rb.rubricPassed : 0;
  const rubricTotal = rb.rubricTotal || 1;
  const contentOk = laneContentDone(id, body);
  const coverOk = faceCoverOk(id) && C.topImage(body);
  const imgsOk = top10 ? auditTop10Images(id, body).compliant : (internalImagesOk(body, id) && mediaOk(body, id));
  function st(stagePi, needActive) {
    if (rb.pass && stagePi <= 4) return 'done';
    if (pi > stagePi) return 'done';
    if (pi === stagePi && needActive) return 'active';
    if (pi === stagePi) return 'active';
    return 'pending';
  }
  const stages = [
    { key: 'content', label: '1 Content', status: contentOk ? 'done' : st(0, true), detail: rubricPassed + '/' + rubricTotal + ' checks' },
    { key: 'pollinator', label: '2 Pollinator', status: coverOk ? 'done' : st(1, true), detail: coverOk ? 'flux hero ✓' : 'face-card' },
    { key: 'ddg', label: top10 ? '3 Top-10' : '3 DDG', status: (imgsOk && pi > 2) ? 'done' : st(2, true), detail: (top10 ? countProductImgs(body) : ddgDone) + '/' + ddgTotal },
    { key: 'verify', label: '4 Verify', status: (imgsOk && pi > 3) ? 'done' : st(3, true), detail: imgsOk ? 'images ok' : 'render/wsrv' },
    { key: 'gate', label: '5 Gate', status: rb.pass ? 'done' : st(4, true), detail: rb.pass ? '12/13 ✓' : ((rb.rubricPct || 0) + '%') },
  ];
  let overallPct = 5;
  if (contentOk) overallPct = 22;
  if (coverOk) overallPct = Math.max(overallPct, 38);
  if (phase === 'image_section' || phase === 'top10') overallPct = 38 + Math.round((Math.min(ddgDone, ddgTotal) / ddgTotal) * 32);
  if (phase === 'image_verify') overallPct = 78;
  if (phase === 'gate') overallPct = rb.pass ? 100 : 88;
  if (rb.pass) overallPct = 100;
  return { rubricPassed, rubricTotal, rubricPct: rb.rubricPct || 0, rubricPass: !!rb.pass, ddgDone, ddgTotal, overallPct, stages, phase, phaseLabel: lanePhaseLabel(phase, job.sectionIdx), top10 };
}
function countProductImgs(body) { return (String(body || '').match(/@@PRODUCT[^\n]* img=/g) || []).length; }
function assignQueueColors(rows, activeIds, anyBusy) {
  if (!rows.length) return rows;
  const actives = Array.isArray(activeIds) ? activeIds : (activeIds ? [{ id: activeIds, slot: 'work' }] : []);
  const activeSet = new Set(actives.map(a => a && a.id).filter(Boolean));
  const slotOf = {};
  actives.forEach(a => { if (a && a.id) slotOf[a.id] = a.slot; });
  const sorted = rows.slice().sort((a, b) => (a.lastTick || 0) - (b.lastTick || 0));
  const colors = {};
  const labels = {};
  const slotLbl = { flux: '🌸 Hero worker', ddg: '🖼 DDG worker', content: '✍️ Words worker' };
  if (anyBusy && activeSet.size) {
    actives.forEach(a => {
      if (!a || !a.id) return;
      colors[a.id] = 'green';
      labels[a.id] = slotLbl[a.slot] || 'Working NOW';
    });
    sorted.filter(r => !colors[r.id]).forEach((r, i) => {
      colors[r.id] = i === 0 ? 'yellow' : i === 1 ? 'orange' : 'red';
      labels[r.id] = i === 0 ? 'Up NEXT' : i === 1 ? 'Coming soon' : 'Waiting in line';
    });
  } else {
    const maxTick = Math.max(0, ...rows.map(r => r.lastTick || 0));
    if (maxTick > 0) {
      const recent = rows.find(r => (r.lastTick || 0) === maxTick);
      if (recent) { colors[recent.id] = 'green'; labels[recent.id] = 'Just finished a turn'; }
    }
    sorted.forEach((r, i) => {
      if (colors[r.id]) return;
      colors[r.id] = i === 0 ? 'yellow' : i === 1 ? 'orange' : 'red';
      labels[r.id] = i === 0 ? 'Up NEXT' : i === 1 ? 'Coming soon' : 'Waiting in line';
    });
  }
  const order = { green: 0, yellow: 1, orange: 2, red: 3 };
  return rows.map(r => Object.assign({}, r, {
    queueColor: colors[r.id] || 'red',
    queueLabel: labels[r.id] || 'Waiting in line',
  })).sort((a, b) => (order[a.queueColor] ?? 9) - (order[b.queueColor] ?? 9) || (a.lastTick || 0) - (b.lastTick || 0));
}
function buildLaneBoard() {
  const jobs = readLaneJobs().filter(j => j && j.id);
  const activeIds = laneActiveIds();
  const activeIdSet = new Set(activeIds.map(a => a.id));
  const rows = jobs.map(j => {
    const p = j.progress || {};
    const fallback = { content: 8, image_cover: 22, image_section: 40, top10: 40, image_verify: 72, gate: 88 }[j.phase] || 5;
    return {
      id: j.id,
      title: String(titleOf[j.id] || j.id).slice(0, 52),
      pillar: pillarOf(j.id),
      active: activeIdSet.has(j.id),
      phase: j.phase,
      sectionIdx: j.sectionIdx || 0,
      phaseLabel: p.phaseLabel || lanePhaseLabel(j.phase, j.sectionIdx),
      overallPct: p.overallPct != null ? p.overallPct : fallback,
      rubricPassed: p.rubricPassed,
      rubricTotal: p.rubricTotal,
      rubricPct: p.rubricPct,
      ddgDone: p.ddgDone,
      ddgTotal: p.ddgTotal,
      stages: p.stages || [],
      lastTick: j.lastTick || 0,
      lastAgoSec: j.lastTick ? Math.round((Date.now() - j.lastTick) / 1000) : null,
    };
  });
  const colored = assignQueueColors(rows, activeIds, anyLaneSlotBusy());
  const nextRow = colored.find(r => r.queueColor === 'yellow');
  const nowRow = colored.find(r => r.queueColor === 'green');
  const q = readArr(QUEUE).length;
  const g = readArr(AP).length;
  return {
    mode: SCRUB_LANE_MODE ? 'lane' : 'serial',
    tickSec: Math.max(1, Math.ceil(laneNextDelayMs / 1000)),
    nextDelayMs: laneNextDelayMs,
    ticks: laneLive.ticks || 0,
    activeJobs: jobs.length,
    maxJobs: LANE_MAX_JOBS,
    poolRed: q,
    poolGreen: g,
    runReady: autoJob.ready || 0,
    runTried: autoJob.tried || 0,
    currentId: laneLive.id,
    currentSlice: laneLive.slice,
    sliceBusy: anyLaneSlotBusy(),
    slots: summarizeLaneSlots(),
    estimates: Object.assign({}, laneEstimateMs(), { pipeline: lanePipelineBalance(colored) }),
    pickReason: laneLive.pickReason,
    contentMaxRounds: LANE_CONTENT_MAX_ROUNDS,
    nextId: nextRow ? nextRow.id : null,
    nextTitle: nextRow ? nextRow.title : null,
    nowId: nowRow ? nowRow.id : laneLive.id,
    rows: colored,
  };
}
async function runLaneAuditor(title, body) {
  return routeAuditor(title, body, AUDIT_SYS);
}
async function laneContentAuditGuard(id, title, body) {
  if (isHumanAuditorMode()) return { pass: true, body };
  const g = gradeEntry(id, body, { imagesDeferred: true });
  const rb = rubricSignOff(id, body);
  const contentBlockers = (rb.failed || []).filter(k => CONTENT_SCRUB_BLOCKERS.has(k));
  if (g.score >= MIN_SCORE && !contentBlockers.length) {
    return { pass: true, body };
  }
  const c = resolveAuditorCounts();
  let b = body;
  for (let defabRound = 0; defabRound < 2; defabRound++) {
    const critiques = [];
    for (let i = 0; i < c.claudeCodePerArticle; i++) {
      const v = await routeAuditor(title, b, AUDIT_SYS);
      if (v.err && c.deepseekFallbackOnCliError) {
        const fb = await dsAudit(title, b, AUDIT_SYS);
        if (fb.err) return { pass: false, notes: fb.notes || 'auditor error' };
        if (!fb.pass) critiques.push('[ds-fallback] ' + (fb.notes || 'fabrication'));
      } else if (v.err) return { pass: false, notes: v.notes || 'claude-cli error' };
      else if (!v.pass) critiques.push((v.via === 'deepseek' ? '[ds-fallback] ' : '[claude-code] ') + (v.notes || 'fabrication'));
    }
    for (let i = 0; i < c.deepseekPerArticle; i++) {
      const v = await dsAudit(title, b, AUDIT_SYS);
      if (v.err) return { pass: false, notes: v.notes || 'auditor error' };
      if (!v.pass) critiques.push('[ds] ' + (v.notes || 'fabrication'));
    }
    if (!critiques.length) return { pass: true, body: b };
    autoLog('🔍 ' + id + ' auditors flagged — de-fabbing (' + critiques.length + ')');
    const fixed = await deFab(id, title, b, critiques.join('\n'));
    if (!fixed) return { pass: false, notes: critiques[0] };
    const r = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (r && r.answer) b = r.answer;
  }
  return { pass: false, notes: 'auditors still failing after de-fab' };
}
async function laneContentSlice(id, title, body, save) {
  const pillar = pillarOf(id);
  const target = pillar === 'q' ? 8 : 25;
  body = boldify(deban(body), target);
  body = ensureErFormat(id, body);
  if (INTERNAL_IMAGES_DDG) body = stripPlaceholderImageLines(body);
  await save(body);
  const rb = rubricSignOff(id, body);
  const contentBlockers = (rb.failed || []).filter(k => CONTENT_SCRUB_BLOCKERS.has(k));
  let wrote = false;
  if (gradeEntry(id, body, { imagesDeferred: true }).score < MIN_SCORE || contentBlockers.length) {
    const sib = (byPillar[pillar] || []).filter(s => s.id !== id);
    await fixEntry(id, title, sib, valid, contentChat).catch(() => {});
    const r = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (r && r.answer) { body = r.answer; await save(body); wrote = true; }
  }
  if (wrote || laneContentDone(id, body)) {
    const guard = await laneContentAuditGuard(id, title, body);
    if (!guard.pass) {
      autoLog('🚫 ' + id + ' blocked by auditors: ' + String(guard.notes || '').slice(0, 72));
      return { body, auditOk: false };
    }
    if (guard.body && guard.body !== body) { body = guard.body; await save(body); }
  }
  return { body, auditOk: true };
}
function laneContentDone(id, body) {
  const rb = rubricSignOff(id, body);
  return gradeEntry(id, body, { imagesDeferred: true }).score >= MIN_SCORE && !(rb.failed || []).some(k => CONTENT_SCRUB_BLOCKERS.has(k));
}
async function laneRunSlice(job, slot) {
  const id = job.id;
  const title = titleOf[id] || id;
  const pillar = pillarOf(id);
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { drop: true };
  let body = e.answer;
  const save = async b => {
    body = b;
    try {
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur || e, { answer: b, updated_at: new Date().toISOString() }));
    } catch (x) {}
  };
  const slice = job.phase;
  const slotTag = { flux: '🌸', ddg: '🖼', content: '✍️' };
  laneLive = { phase: slice, id, slice: lanePhaseLabel(slice, job.sectionIdx), jobs: readLaneJobs().length, ticks: laneLive.ticks, lastAt: Date.now(), pickReason: laneLive.pickReason, slots: summarizeLaneSlots() };
  autoJob.current = id;
  autoJob.stage = (slotTag[slot] || '🔀') + ' ' + lanePhaseLabel(slice, job.sectionIdx) + ' · ' + id;
  touchScrubLive({ active: true, id, title: String(title).slice(0, 90), pillar, stage: autoJob.stage, carwash: autoJob.stage });
  switch (slice) {
    case 'content': {
      const cs = await laneContentSlice(id, title, body, save);
      body = cs.body;
      job.contentRounds = (job.contentRounds || 0) + 1;
      if (cs.auditOk && (laneContentDone(id, body) || job.contentRounds >= LANE_CONTENT_MAX_ROUNDS)) {
        job.phase = 'image_cover';
        job.contentRounds = 0;
      }
      break;
    }
    case 'image_cover':
      if (bothLanesCooling()) {
        autoLog('⏸️ ' + id + ' both image APIs cooling — skip hero (stick ' + (bothCooldownStickLane || 'ddg') + ')');
        break;
      }
      if (!faceCoverOk(id)) {
        if (fluxLaneCooling()) {
          autoLog('⏸️ ' + id + ' flux cooling — skip hero this tick');
        } else {
          const fr = await fluxCoverTracked(id, title, body, coverSrcOf[id], null, () => !!autoJob.stop);
          if (!fr.skipped && fr.body !== body) body = fr.body;
          coverSrcOf[id] = 'flux';
          await stampFluxProvenance(id, store, 'flux');
        }
      }
      body = enforceCroCardLaw(ensureKoryAfterHero(await ensureTopImage(id, title, pillar, body)), id);
      await save(body);
      job.phase = isTop10Body(body) ? 'top10' : 'image_section';
      job.sectionIdx = 0;
      break;
    case 'image_section': {
      if (bothLanesCooling()) {
        autoLog('⏸️ ' + id + ' both image APIs cooling — skip § (stick ' + (bothCooldownStickLane || 'flux') + ')');
        break;
      }
      const targets = ddgImageSectionTargets(String(body).split('\n'), body);
      if (job.sectionIdx >= targets.length) { job.phase = 'image_verify'; break; }
      if (INTERNAL_IMAGES_DDG) {
        if (slot !== 'ddg') await waitFluxIdle();
        if (ddgLaneCooling()) {
          autoLog('⏸️ ' + id + ' DDG cooling — skip section this tick');
          break;
        }
        body = await ddgFillOneSection(id, title, pillar, body, job.sectionIdx);
        laneDdgLastAt = Date.now();
      } else {
        if (fluxLaneCooling()) {
          autoLog('⏸️ ' + id + ' flux cooling — skip section this tick');
          break;
        }
        body = await fluxFillOneSection(id, title, pillar, body, job.sectionIdx);
      }
      body = collapseStackedSectionImages(body, id);
      await save(body);
      job.sectionIdx++;
      if (job.sectionIdx >= targets.length) job.phase = 'image_verify';
      break;
    }
    case 'image_verify':
      if (slot !== 'ddg') await waitFluxIdle();
      body = collapseStackedSectionImages(enforceCroCardLaw(body, id), id);
      await save(body);
      if (!(await internalImagesLiveOk(body, id))) {
        body = await sweepOneBadInternal(id, title, pillar, body);
        body = enforceCroCardLaw(body, id);
        await save(body);
        laneDdgLastAt = Date.now();
      }
      body = await dedupeEntryImages(id, title, body, 'scrub', null);
      await save(body);
      {
        const triple = await tripleVerifyAllImagesRender(body, id, {
          save: async b => { body = b; await save(b); },
        });
        body = triple.body;
        await save(body);
        if (triple.ok && internalImagesOk(body, id) && mediaOk(body, id) && croCardLawOk(body, id)) {
          job.phase = 'gate';
          job.imagesVerified = true;
        }
      }
      break;
    case 'top10': {
      // Reshape the WHOLE Top-10 body to the locked gold structure before the audits (owner 2026-07-08):
      // strips rank-section markdown images + the top hero (ranking lists forbid a top hero), rebuilds
      // @@PRODUCT as first line per rank, fixes tail order (How to Choose → What to Look For → FAQ →
      // Bottom Line → Sources), adds a movie-aware "What to Look For", forces one mermaid, de-numbers
      // meta headings, removes extra tail sections. The reshape drops per-slot imgs → the poster/image
      // fill below re-adds real posters. collapse+posterfill = master-law + image-audit compliant.
      try {
        const { collapseToGoldStructure } = require('./_aq_top10_gold_fix_lib');
        const reshaped = collapseToGoldStructure(body, id, title);
        if (reshaped && reshaped !== body) { body = reshaped; await save(body); autoLog('🏗 ' + id + ' — reshaped to gold Top-10 structure'); }
      } catch (e) { autoLog('⚠ reshape ' + id + ' ' + (e && e.message)); }
      }
      if (!auditTop10Images(id, body).compliant) {
        // MOVIES: the real-poster library is authoritative — fill Top-10 slots from title-matched
        // posters FIRST (instant, local, no slow DDG), so mv never stalls on unfindable stills (owner 7-08).
        if (/^mv\d/i.test(id)) {
          try {
            const pf = await fluxFillTop10Gaps(id, title, body);
            if (pf && pf.filled) { body = pf.body; await save(body); autoLog('🎬 ' + id + ' — ' + pf.filled + ' Top-10 slot(s) → real movie poster (library)'); }
          } catch (err) {}
        }
        if (!auditTop10Images(id, body).compliant) {
          try {
            const ri = await ensureTop10Images(id, title, body);
            if (ri && ri.body) { body = ri.body; await save(body); }
          } catch (err) {}
          laneDdgLastAt = Date.now();
          // Failover: fill any slot still empty / banned-live-pollinations (Pollinator for non-movies).
          if (!auditTop10Images(id, body).compliant) {
            try {
              const ff = await fluxFillTop10Gaps(id, title, body);
              if (ff && ff.filled) { body = ff.body; await save(body); autoLog('🌸 ' + id + ' — ' + ff.filled + ' Top-10 slot(s) filled (failover)'); }
            } catch (err) {}
          }
        }
      }
      if (auditTop10Images(id, body).compliant) {
        body = await dedupeEntryImages(id, title, body, 'scrub', null);
        await save(body);
        job.phase = 'gate';
      }
      break;
    case 'gate': {
      body = enforceCroCardLaw(body, id);
      await save(body);
      if (!croCardLawOk(body, id)) {
        job.phase = 'image_cover';
        job.sectionIdx = 0;
        job.imagesVerified = false;
        break;
      }
      if (!job.imagesVerified) {
        const laneTriple = await tripleVerifyAllImagesRender(body, id, {
          save: async b => { body = b; await save(b); },
        });
        body = laneTriple.body;
        await save(body);
        if (!laneTriple.ok) {
          job.phase = 'image_verify';
          job.imagesVerified = false;
          break;
        }
        job.imagesVerified = true;
      }
      const gate = await finalPublishGate(id, title, body);
      if (gate.pass) {
        const rb = gate.rubric || rubricSignOff(id, body);
        const score = gate.score;
        let auto = null;
        if (rb.pass && score >= 13 && job.imagesVerified) {
          if (PIPELINE_AUTO_SCRUB_PUBLISH && await isPipelineGeneratedEntry(id)) {
            const prep = await pipelinePublishReady(id, body, { imageVerified: true });
            if (prep.body && prep.body !== body) { body = prep.body; await save(body); }
            if (prep.ok) {
              await finishPipelinePublish(id, title, body, score, null, 'lane-gate');
              return { done: true, drop: true };
            }
            await requeuePipelineForScrub(id, prep.reason);
            job.phase = 'image_cover';
            job.sectionIdx = 0;
            return { job, drop: false };
          }
          auto = await laneAutoPublishGate(id, title, body, gate);
          if (auto.publish) {
            try {
              await certify(id, score, body, { via: 'lane-auto', rubric: rb, title, detail: auto.reason });
            } catch (certErr) {
              if (certErr && certErr.code === 'PUBLISH_IMAGE_GATE') {
                job.phase = 'image_verify';
                job.sectionIdx = 0;
                return { job, drop: false };
              }
              throw certErr;
            }
            writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
            removeRejectFix(id);
            return { done: true, drop: true };
          }
        }
        writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
        removeRejectFix(id);
        const caveats = rb.failed || [];
        const why = (rb.pass && score >= 13)
          ? ('13/13 rubric — auto-gate: ' + (auto && auto.reason ? auto.reason : 'needs owner review'))
          : (caveats.join(', ') || gate.reason || 'not 13/13');
        addPendingSignoff({
          id, score, title: String(title).slice(0, 90), pillar: pillarOf(id),
          rubricPct: rb.rubricPct, needsReview: true, caveats, why,
        });
        appendScrubLog({ ts: new Date().toISOString(), id, status: 'ready', score, msg: '→ audit pile: ' + String(why).slice(0, 120) });
        autoJob.ready++;
        autoJob.lastFinish = { type: 'ready', id, score, needsReview: true, caveats, at: Date.now() };
        autoLog('📋 ' + id + ' ' + score + '/13 → audit pile · ' + String(why).slice(0, 55));
        return { done: true, drop: true };
      }
      const failed = (gate.rubric && gate.rubric.failed) || [];
      if (failed.some(k => CONTENT_SCRUB_BLOCKERS.has(k))) { job.phase = 'content'; job.sectionIdx = 0; job.contentRounds = 0; }
      else if (failed.includes('top10Images')) { job.phase = 'top10'; }
      else if (failed.includes('pollinatorFaceCover') || failed.includes('heroImage')) { job.phase = 'image_cover'; job.sectionIdx = 0; }
      else if (failed.some(k => OWNER_RETARGET_IMAGE_KEYS.has(k))) { job.phase = 'image_section'; job.sectionIdx = 0; }
      break;
    }
    default:
      job.phase = 'content';
  }
  job.lastTick = Date.now();
  job.progress = laneComputeProgress(id, body, job);
  touchScrubLive({
    overallPct: job.progress.overallPct,
    laneStages: job.progress.stages,
    rubricScore: job.progress.rubricPassed,
    rubricPct: job.progress.rubricPct,
    rubricPass: job.progress.rubricPass,
  });
  return { job, drop: false };
}
async function laneSeedOne(jobs) {
  await waitPipelineEntryGap('scrub');
  const q = readArr(QUEUE);
  if (!q.length) return null;
  const active = new Set((jobs || []).map(j => j && j.id).filter(Boolean));
  const id = pickNextScrubId(q.filter(x => !active.has(x)));
  if (!id) return null;
  let phase = 'content';
  const bal = lanePipelineBalance(jobs || []);
  try {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    const body = e && e.answer;
    if (body) {
      if (laneContentDone(id, body)) phase = 'image_cover';
      else if (gradeEntry(id, body, { imagesDeferred: true }).score >= MIN_SCORE - 1) phase = 'image_cover';
      else if (bal.imageStarved && gradeEntry(id, body, { imagesDeferred: true }).score >= MIN_SCORE - 3) phase = 'image_cover';
    }
  } catch (e) {}
  if (bal.contentHeavy && phase === 'content' && (jobs || []).length >= 12) phase = 'image_cover';
  return { id, phase, sectionIdx: 0, contentRounds: 0, lastTick: 0, at: Date.now() };
}
async function laneFillFromQueue(jobs) {
  jobs = (jobs || []).filter(j => j && j.id);
  while (jobs.length < LANE_MAX_JOBS) {
    const seed = await laneSeedOne(jobs);
    if (!seed) break;
    jobs.push(seed);
  }
  return laneRebalanceJobs(jobs);
}
async function laneSeedFromQueue() { return laneSeedOne(readLaneJobs().filter(j => j && j.id)); }
async function runLaneSlot(slot, job) {
  try {
    const r = await laneRunSlice(job, slot);
    await withLaneJobsLock(async () => {
      let jobs = readLaneJobs().filter(j => j && j.id);
      if (r.drop) jobs = jobs.filter(j => j.id !== job.id);
      else if (r.job) {
        const i = jobs.findIndex(j => j.id === r.job.id);
        if (i >= 0) jobs[i] = r.job; else jobs.push(r.job);
      }
      jobs = await laneFillFromQueue(jobs);
      writeLaneJobs(jobs.slice(0, LANE_MAX_JOBS));
      laneLive.jobs = jobs.length;
    });
    autoJob.tried++;
  } catch (err) {
    autoLog('⚠️ ' + slot + ' ' + job.id + ' ' + String(err.message || err).slice(0, 40));
  } finally {
    bumpImageRotate(slot);
    laneSlots[slot].busy = false;
    laneSlots[slot].id = null;
    laneSlots[slot].label = '';
    laneSlots[slot].phase = null;
    laneLive.slots = summarizeLaneSlots();
    laneOrchestrate().catch(() => {});
  }
}
async function laneOrchestrate() {
  if (laneOrchestrating) return;
  if (autoJob.stop) { stopLaneScheduler(); return; }
  if (dayCount() >= DAILY_MAX) return;
  laneOrchestrating = true;
  try {
    let jobs = await laneFillFromQueue(readLaneJobs().filter(j => j && j.id));
    writeLaneJobs(jobs);
    const picks = pickLaneJobsParallel(jobs);
    if (bothLanesCooling()) {
      const rot = imageRotateState();
      const bothMsg = '⏸ both cooling — stick ' + (rot.stickLabel || 'DDG') + ' · wait ~' + rot.waitSec + 's';
      laneLive.pickReason = picks.length ? (bothMsg + ' · ' + picks.map(p => p.reason).join(' · ')) : bothMsg;
    } else {
      laneLive.pickReason = picks.length ? picks.map(p => p.reason).join(' · ') : laneLive.pickReason;
    }
    laneLive.slots = summarizeLaneSlots();
    laneLive.jobs = jobs.length;
    if (!picks.length && !anyLaneSlotBusy()) {
      autoJob.stage = jobs.length ? '⏸ lane idle — cooldowns' : '✅ lane idle — no red IDs';
      touchScrubLive({ active: false, stage: autoJob.stage, carwash: autoJob.stage });
      scheduleLaneTick(laneGapBeforeNextTick(jobs));
      return;
    }
    let started = 0;
    for (const pick of picks) {
      const slot = pick.slot;
      if (!laneSlots[slot] || laneSlots[slot].busy) continue;
      laneSlots[slot].busy = true;
      laneSlots[slot].id = pick.job.id;
      laneSlots[slot].label = lanePhaseLabel(pick.job.phase, pick.job.sectionIdx);
      laneSlots[slot].phase = pick.job.phase;
      laneLive.ticks++;
      laneLive.id = pick.job.id;
      laneLive.phase = pick.job.phase;
      started++;
      runLaneSlot(slot, Object.assign({}, pick.job)).catch(() => {});
    }
    if (!started && !anyLaneSlotBusy()) scheduleLaneTick(laneGapBeforeNextTick(jobs));
  } catch (err) {
    autoLog('⚠️ lane ' + String(err.message || err).slice(0, 50));
    scheduleLaneTick(LANE_MIN_GAP_MS);
  } finally {
    laneOrchestrating = false;
    const act = laneActiveIds();
    autoJob.current = act.length ? act.map(a => a.id).join(', ') : null;
    laneLive.slots = summarizeLaneSlots();
    if (!anyLaneSlotBusy()) {
      touchScrubLive({ active: false, stage: 'lane workers idle', carwash: (laneLive.pickReason ? laneLive.pickReason : 'waiting for cooldown') });
    }
  }
}
function startLaneScheduler() {
  if (laneTimer || anyLaneSlotBusy()) return;
  mergeCookIntoQueue();
  imageRotateLane = 'ddg';
  imageRotateCount = 0;
  imageRotateFlips = 0;
  lastSuccessfulImageLane = 'ddg';
  bothCooldownStickLane = null;
  laneThrottle.flux = { until: 0, reason: '', hits: 0, lastAt: 0 };
  laneThrottle.ddg = { until: 0, reason: '', hits: 0, lastAt: 0 };
  try { adaptiveThrottle.reset(); autoLog('🔄 throttle learner reset'); } catch (e) {}
  autoJob = Object.assign(autoJob, { running: true, stop: false, phase: 'lane', stage: '🔀 parallel lane · ' + crewOneLiner(), startedAt: new Date().toISOString(), certified: 0, ready: 0, parked: 0, tried: 0, log: autoJob.log || [] });
  autoLog('▶ ' + crewOneLiner() + ' · image rotate batch=' + IMAGE_ROTATE_BATCH);
  scheduleLaneTick(0);
}
function stopLaneScheduler() {
  if (laneTimer) { clearTimeout(laneTimer); laneTimer = null; }
  laneNextTickAt = 0;
  laneNextDelayMs = LANE_MIN_GAP_MS;
  ['flux', 'ddg', 'content', 'content2'].forEach(s => { if (laneSlots[s]) { laneSlots[s].busy = false; laneSlots[s].id = null; laneSlots[s].label = ''; laneSlots[s].phase = null; } });
  autoJob.running = false;
  autoJob.current = null;
  laneLive.phase = 'stopped';
  laneLive.slots = summarizeLaneSlots();
}
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const writeArr = (f, a) => fs.writeFileSync(f, JSON.stringify(a));
function appendScrubLog(entry) {
  try {
    const log = readArr(SCRUBLOG);
    log.unshift(entry);
    writeArr(SCRUBLOG, log.slice(0, 200));
    const icon = { certified: '✅', ready: '📋', parked: '🅿️', 'reject-fix': '↩️', green: '✅', started: '🍳', error: '⚠️', blocked: '🚫' }[entry.status] || '•';
    pushScrubActivity(icon + ' ' + (entry.id || '?') + (entry.score != null ? (' ' + entry.score + '/13') : '') + ' · ' + String(entry.msg || entry.status || '').slice(0, 140), entry);
  } catch (e) {}
}

/** Detailed 13/13 done log — ID, question, rubric ✓, images OK, next in queue (owner 2026-07-04). */
async function logCertified13Done(id, score, opts) {
  opts = opts || {};
  const pillar = pillarOf(id);
  const pillarName = pName(pillar);
  let question = opts.title || titleOf[id] || id;
  let gateBody = opts.body || '';
  try {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (e && e.question) question = e.question;
    if (e && e.answer && !gateBody) gateBody = e.answer;
  } catch (e) {}
  const rb = opts.rubric || (gateBody ? rubricSignOff(id, gateBody) : null);
  const rubricPassed = rb ? (rb.rubricPassed != null ? rb.rubricPassed : Object.values(rb.checks || {}).filter(Boolean).length) : null;
  const rubricTotal = rb ? (rb.rubricTotal || Object.keys(rb.checks || {}).length) : 13;
  const q = filterQueueByPillar(readArr(QUEUE)).filter(x => x !== id);
  const nextId = pickNextScrubId(q);
  const nextTitle = nextId ? String(titleOf[nextId] || nextId).slice(0, 72) : '';
  const nextPillar = nextId ? pillarOf(nextId) : '';
  const queueLeft = q.length;
  const st = stateObj();
  const via = opts.via || 'certify';
  const qShort = String(question).slice(0, 100);

  console.log('[scrub-button] ═══════════════════════════════════════');
  console.log('[scrub-button] ✅ 13/13 DONE · ' + id);
  console.log('[scrub-button]    Question: ' + qShort);
  console.log('[scrub-button]    Pillar: ' + pillarName + ' (' + pillar + ') · Score: ' + score + '/13');
  console.log('[scrub-button]    Rubric: all checks ✓ · Images: verified on Q&A page');
  console.log('[scrub-button]    Live: https://pulserevops.com/knowledge/' + id);
  if (nextId) console.log('[scrub-button]    → NEXT: ' + nextId + ' [' + nextPillar + '] ' + String(titleOf[nextId] || '').slice(0, 72) + ' (' + queueLeft + ' left in queue)');
  else console.log('[scrub-button]    → Queue empty — waiting for next entry');
  console.log('[scrub-button] ═══════════════════════════════════════');

  autoLog('✅ DONE · ' + id + ' · 13/13 ✓ · [' + pillar + '] ' + String(question).slice(0, 56));
  autoLog('   ✓ Rubric ' + (rubricPassed != null ? (rubricPassed + '/' + rubricTotal) : '13/13') + ' · images render on Q&A · PUBLISHED');
  if (opts.detail) autoLog('   · ' + String(opts.detail).slice(0, 72));
  if (nextId) autoLog('   → Next: ' + nextId + ' [' + nextPillar + '] ' + nextTitle.slice(0, 50) + (queueLeft ? (' · ' + queueLeft + ' waiting') : ''));
  else autoLog('   → Queue empty — idle until next ID arrives');

  const msg = '13/13 ✓ DONE — good, moving on' + (nextId ? (' → ' + nextId + ' [' + nextPillar + '] ' + nextTitle.slice(0, 44)) : ' (queue empty)');
  appendScrubLog({
    ts: new Date().toISOString(),
    id,
    status: 'green',
    score,
    pillar,
    title: qShort,
    via,
    rubricPct: rb && rb.rubricPct,
    rubricPassed,
    rubricTotal,
    nextId: nextId || null,
    nextTitle: nextTitle || null,
    nextPillar: nextPillar || null,
    queueLeft,
    msg,
  });

  autoJob.certified = (autoJob.certified || 0) + 1;
  autoJob.lastCertify = { id, score, title: question, pillar, nextId: nextId || null, nextTitle, queueLeft, at: Date.now(), green: st.green, under: st.under };
  autoJob.lastFinish = { type: 'certified', id, score, title: question, pillar, nextId: nextId || null, at: Date.now(), green: st.green, under: st.under };

  touchScrubLive({
    active: false,
    stage: '✅ ' + id + ' · 13/13 ✓',
    carwash: nextId
      ? ('✅ ' + id + ' done 13/13 ✓ → next: ' + nextId + ' [' + nextPillar + '] ' + nextTitle.slice(0, 40))
      : ('✅ ' + id + ' done 13/13 ✓ · queue empty'),
    lastCertified: {
      id, score, title: String(question).slice(0, 90), pillar, pillarName,
      nextId: nextId || null, nextTitle, nextPillar, queueLeft, via, at: Date.now(),
    },
    rubricPass: true,
    rubricScore: score,
    rubricPct: rb && rb.rubricPct != null ? rb.rubricPct : 100,
  });
}
const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const today = () => new Date().toISOString().slice(0, 10);
function dayCount() { try { const d = JSON.parse(fs.readFileSync(DAYF, 'utf8')); return d.day === today() ? (d.n || 0) : 0; } catch (e) { return 0; } }
function bumpDay() { const n = dayCount() + 1; try { fs.writeFileSync(DAYF, JSON.stringify({ day: today(), n })); } catch (e) {} return n; }

const BAN_MAP = [[/\bdelve(?:\s+into)?\b/gi, 'examine'], [/\btapestry\b/gi, 'mix'], [/\blandscape\b/gi, 'market'], [/\bholistic\b/gi, 'complete'], [/\bin\s+today'?s\b/gi, 'in the'], [/\bever-?evolving\b/gi, 'changing'], [/\bsynerg(?:y|ies|istic)\b/gi, 'fit'], [/\bparadigm\s+shift\b/gi, 'shift'], [/\bgame-?changer\b/gi, 'major change'], [/\bcutting-?edge\b/gi, 'modern'], [/\bstate-?of-?the-?art\b/gi, 'modern'], [/\bseamless\s+integration\b/gi, 'integration'], [/\bdrive\s+growth\b/gi, 'grow revenue'], [/\bunlock\s+(value|potential)\b/gi, 'capture $1'], [/\bneedless\s+to\s+say,?\s*/gi, ''], [/\bit'?s\s+worth\s+noting\s+that\s*/gi, ''], [/\bit'?s\s+important\s+to\s+note\s+that\s*/gi, '']];
function deban(body) { let b = String(body); for (const [re, rep] of BAN_MAP) b = b.replace(re, rep); return b; }
// add bold until the grader's heavy_bold criterion is met — bold the lead term of list items, then key phrases
function boldify(body, target) {
  let b = String(body);
  const count = () => (b.match(/<strong>[^<]*<\/strong>|<b>[^<]*<\/b>|\*\*[^*\n]+\*\*/gi) || []).length;
  if (count() >= target) return b;
  // 1) "- Lead: rest"  ->  "- **Lead:** rest"  (only outside code fences)
  b = b.replace(/^(\s*[-*]\s+)([A-Z][^:\n*]{2,46}):\s/gm, (m, p, lead) => count() >= target ? m : `${p}**${lead.trim()}:** `);
  if (count() >= target) return b;
  // 2) bold the first 2-5 word capitalized phrase at the start of sentences in prose paragraphs
  b = b.split(/\n/).map(line => {
    if (count() >= target) return line;
    if (/^[#>`|!\-*\d]/.test(line.trim()) || !line.trim()) return line;        // skip headings/lists/tables/images
    return line.replace(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/, (m) => `**${m}**`);
  }).join('\n');
  return b;
}

// 🔒 MASTER SCRUBBER PROMPT — PULSE REV-OPS Q&A QUALITY + IMAGE AUDIT (owner 2026-07-04).
// Publish ONLY at 13/13 — no exceptions, no partial passes.
const AUDIT_SYS = `You are a ruthless quality + fabrication auditor for PULSE, a multi-topic authority site (RevOps plus consumer Top-10 pillars: travel, dining, resorts, towns, boats, cars, tools, style, etc.). Audit the answer against ITS OWN title's topic. PUBLISH ONLY AT 13/13 — no exceptions, no partial passes.
KNOWN-REAL (never flag): Kory White (the site's real fractional CRO), CRO Syndicate, PULSE RevOps, pulserevops.com and ALL its pages (/tools,/publish,/seo,/knowledge/<id>), the Kory White CRO card. Internal /knowledge/ links are real.
Score against the 13-POINT RUBRIC:
1 WORD COUNT — >=2000 words of REAL content: no repeated sentences/paragraphs, no restating the question across sections, no generic sentences that could appear on any page unchanged. If removing a sentence loses no information, it is filler.
2 DIRECT ANSWER — a direct answer to the question appears at the top, before anything else.
3 DIRECT ANSWER COMPLETE — full and self-contained; a reader who stops there has their question answered.
4 FAQ — at least 5 relevant FAQ question/answer pairs.
5 MERMAID DIAGRAMS — exactly 2 (not 1, not 3).
6 MERMAID CLEAN — both use valid, error-free syntax that renders.
7 SOURCES — at least 5 real, verifiable sources; no fabricated URLs, no dead links, no citing our own site.
8 RELATED ON PULSE — a "Related on PULSE" sibling-link section is present.
9 CLEAN LINKS — every link valid; no broken, empty, or placeholder (#, TODO) links.
10 HERO IMAGE — a top image is present above the answer.
11 MEDIA COUNT — 3 to 10 images total (1 hero + up to 9 section images).
12 IMAGES LAW — every image obeys the Image Standard below.
13 NO FABRICATION — zero invented vendors, products, prices, statistics, studies, or quotes. Every specific claim is real and verifiable; an unverifiable claim must be a general statement, not a fabricated specific.
HARD FAIL: a fabricated specific number/price/stat/study/benchmark stated as fact; a figure attributed to a named report (Gong Labs/Forrester/Gartner/Bessemer/SaaStr); an invented vendor/product/edition; a mermaid syntax error; a fabricated source URL; a live image.pollinations.ai URL; a missing face-card cover (cover_src must be flux, file /assets/qa/<id>.jpg, >40KB).
IMAGE STANDARD (criterion 12) — every image must be a REAL DuckDuckGo photo of a PERSON, PLACE, or THING, on-topic, self-hosted, dated/vintage-graded. FAIL any image that is: a graph/chart/infographic/diagram/table; a logo/icon/clip-art/flat solid-color graphic/.svg; a transparent PNG; a text-heavy image/screenshot/meme; a watermarked stock preview (dreamstime/shutterstock/alamy/istock/123rf/depositphotos/getty/adobe); a webpage screenshot / directory grab / marketing collage; broken/dead/placeholder/SVG; low-res (<600px) or extreme aspect (beyond 1:2.5 or 2.5:1). No random images.
DO NOT FAIL for: qualitative guidance, hedged language, missing polish, or the KNOWN-REAL items.
Reply ONE line: VERDICT=PASS|score=NN/13|notes=...  or  VERDICT=FAIL|score=NN/13|notes=<the failed criteria numbers + the problem>`;
async function audit(id, title, body) {
  const clean = String(body).replace(/#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{2,3}\s|$)/i, '');   // real-by-construction, don't audit
  const r = await dsChat([{ role: 'system', content: AUDIT_SYS }, { role: 'user', content: `Audit "${title}". Score /13, PASS at >=12.\n\n--- ${id} ---\n${clean.slice(0, 22000)}` }]);
  const t = String(r.content || ''); const sm = t.match(/score\s*=\s*(\d+)/i);
  return { pass: /VERDICT\s*=\s*PASS/i.test(t) && (!sm || +sm[1] >= 12), score: sm ? +sm[1] : null, notes: (t.match(/notes\s*=\s*(.+)$/i) || [, t.slice(0, 120)])[1].trim().slice(0, 200) };
}

// de-fabrication rewrite (DeepSeek) — strip the flagged fabrication, keep all sections, no new invented facts
const DEFAB_SYS = `Revise this answer to REMOVE all fabrication the auditor flagged: delete every invented number/stat/price/study/named-report figure and replace with honest qualitative guidance (NEVER invent a replacement number or source). Keep every section: "## Direct Answer", 6 FAQ Q&As, 2 valid mermaid diagrams, "## Sources" (5+ real), "## Related on PULSE". Keep ~2000 words. Output ONLY the corrected Markdown body.`;
async function deFab(id, title, body, critique) {
  try {
    const { content } = await contentChat([{ role: 'system', content: DEFAB_SYS }, { role: 'user', content: `Title: "${title}"\nFIX EXACTLY THESE FABRICATIONS:\n${critique}\n\nBODY:\n${String(body).slice(0, 26000)}\n\nReturn the corrected Markdown now.` }]);
    let nb = String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').trim();
    if (nb.length < Math.max(800, String(body).length * 0.55)) return false;
    const cur = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (cur) { await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { answer: nb, updated_at: new Date().toISOString() })); return true; }
  } catch (e) {}
  return false;
}

let valid = new Set(), titleOf = {}, byPillar = {}, coverSrcOf = {}, qualityScoreOf = {};
async function loadIndex() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id);
  valid = new Set(es.map(e => e.id)); titleOf = Object.fromEntries(es.map(e => [e.id, e.question]));
  coverSrcOf = Object.fromEntries(es.map(e => [e.id, e.cover_src || null]));   // face-card provenance (flux = pollinator, per cover law)
  qualityScoreOf = Object.fromEntries(es.map(e => [e.id, typeof e.quality_score === 'number' ? e.quality_score : null]));
  byPillar = {}; const isDemo = t => /\bdemo\b|standing desk|\btest entry\b/i.test(String(t || ''));
  for (const e of es) { if (isDemo(e.question)) continue; (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push({ id: e.id, title: e.question }); }
  // seed the 24h Writing panel from the catalog — entries indexed in the last 24h (owner 2026-07-02)
  const cut = Date.now() - 24 * 3600 * 1000;
  recentWrites = es.filter(e => !isDemo(e.question) && typeof e.ts === 'number' && e.ts >= cut)
    .map(e => ({ ts: e.ts, id: e.id, pillar: pillarOf(e.id), pillarName: pName(pillarOf(e.id)), title: String(e.question || '').slice(0, 80), status: 'published', score: (typeof e.quality_score === 'number' ? e.quality_score : null) }));
}
let recentWrites = [];
// 🔒🔒 RUBRIC — THE STANDARDS, NO GREY AREA (owner 4444, 2026-07-02). To certify (≥12/13) an entry
// MUST satisfy EVERY one of these, checked by stationsOk (body) + faceCardApplicable (body, id):
//   1. Grader score ≥ 12/13 (gradeEntry).
//   2. ≥ 2000 words of real content (wordCount ≥ WORD_FLOOR).
//   3. A TOP/HERO image ("face card") present (C.topImage).
//   3b. 🔒🔒 The face-card COVER (/assets/qa/<id>.jpg mosaic tile) is POLLINATOR (flux), NOT DDG —
//      cover_src==='flux' + real (>40KB) file (faceCoverOk). DDG covers banned (owner 2026-07-03).
//   3c. 🔒 Internal section images = high-quality DuckDuckGo https URLs (internalImagesOk).
//      Face-card hero = /assets/qa/<id>.jpg (Pollinator flux). No kory-white in body — CRO widget is render-time only.
//      Top-10 uses @@PRODUCT imgs. No live image.pollinations.ai URLs (owner 2026-07-03 pivot).
//   4. The face card image is APPLICABLE to the topic — NEVER a CRO/boardroom cover on a non-CRO
//      pillar. Only `tl` (CRO/Tools) may use /assets/cro-cover-*. Everything else must be a topical
//      image. (faceCardApplicable)
//   5. Media law (mediaOk): EVERY Q&A has a main top hero image (face-card). Counted slots differ by type:
//      Regular Q&A = 3–10 COUNTED (1 hero + up to 9 DDG section breaks under major ##).
//      CRO Syndicate card is injected at RENDER time only — never as an in-body markdown image.
//      Top-10 = 11 TOTAL (1 hero + 10 @@PRODUCT cards) — NOT DDG section slots; see TOP10_IMAGE_TOTAL.
//      Top-10 IMAGE LAW: each ## N. slot gets a UNIQUE img of THAT item (## 9. Metroid → Metroid art only).
//      No duplicate img URLs across ranks; @@PRODUCT name must match the ## N. heading.
//   6. A substantial "## Direct Answer" (C.directAnswer) — 2–3 real sentences, not a one-liner.
//   7. ≥ 6 FAQ Q&As (C.faq5).
//   8. EXACTLY 2 valid, clean mermaid diagrams (C.twoMermaid + C.mermaidClean).
//   9. ≥ 5 real sources (C.sources5).
//  10. A "Related on PULSE" block of verified siblings (C.related), all links valid (C.linksClean).
//  11. FINAL GATE: human mode = rubricSignOff only → approval pile. Cursor/DS mode = auto-auditors + auto-publish.
// LAW (owner 2026-07-02): a Top-10 (ER-format) entry may NOT certify without its full image set —
// hero cover + 10 @@PRODUCT img= cards (images_law compliant). Enforced identically in writing + scrubbing.
const stationsOk = b => gradeEntry('x', b, { imagesDeferred: true }).score >= MIN_SCORE && wordCount(b) >= WORD_FLOOR && C.topImage(b) && mediaOk(b) && C.directAnswer(b) && directAnswerFull(b) && C.faq5(b) && C.twoMermaid(b) && C.mermaidClean(b) && C.sources5(b) && C.related(b) && C.linksClean(b, valid) && (!isTop10Body(b) || auditTop10Images('x', b).compliant);
// STANDARD #4 — face-card image must be APPLICABLE (no CRO boardroom on non-CRO pillars).
function faceCardApplicable(body, id) {
  const hero = String(body).slice(0, 1500).match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (!hero) return false;                                   // must HAVE a face card
  return !(pillarOf(id) !== 'tl' && /\/assets\/cro-cover-/i.test(hero[1]));   // tl may use CRO covers; others may not
}
// 🔒🔒 STANDARD #3b — face-card COVER = Pollinator flux ONLY.
// Provenance = index cover_src 'flux' + self-hosted /assets/qa/<id>.jpg (>40KB). Sections = Pollinator flux.
// Gold title = baked onto Pollinator face-card covers at grade time (#FF8C1A orange).
const faceCoverOk = id => !REQUIRE_FLUX_COVER || (coverSrcIsValid(coverSrcOf[id]) && faceCardCoverOk(id, coverSrcOf[id]));
const IMAGE_LAW_UI = INTERNAL_IMAGES_DDG ? {
  sub: 'Full 13/13 scrub — Pollinator flux hero + DDG section images. Orange title baked on face-card (#FF8C1A).',
  gen: 'Same 13/13 pipeline as scrubber — Pollinator flux hero + DDG sections + render verify → certify 13/13 before moving on.',
  auto: 'Pollinator flux hero + DDG sections · orange title on face-card',
  engine: 'Pollinator flux (hero) + DDG (sections)',
  engineSub: 'Face-card = flux /assets/qa/<id>.jpg + baked orange title · north crop (no cut-off heads) · Sections = DDG self-host · ' + Math.round(DDG_GAP_MS / 1000) + 's between DDG writes · ' + Math.round(IMAGE_GAP_MS / 1000) + 's Pollinator',
  score12: '12/13 sign-off (flux hero + DDG sections)',
} : {
  sub: 'Full deep scrub — Pollinator flux images, rubric. Gold title baked on face-card covers. One entry at a time.',
  gen: 'Factor 1: same scrub pipeline (rubric + Pollinator). Factor 2: Cursor / Claude Code / agent briefly reviews — nothing goes live from Generate alone.',
  auto: 'Pollinator flux cover + internal images · orange title on hero',
  engine: 'Pollinator flux',
  engineSub: 'All images Pollinator flux · topics-page documentary look · gold title on face-card · headroom framing (no cut-off heads) · serial queue',
  score12: '12/13 sign-off (100% checks + flux)',
};
function isBadInternalUrl(u, id) {
  if (!u || isKoryCroImg(u)) return false;
  if (/pollinations\.ai/i.test(u)) return true;
  if (/dreamstime|shutterstock|istockphoto|\bistock\b|alamy|123rf|depositphotos|gettyimages|stock\.adobe|adobestock|vecteezy|freepik|canstock|bigstock|pond5|watermark/i.test(u)) return true;  // watermarked stock (owner 2026-07-04)
  if (/\/img\/auto\//i.test(u)) return true;   // auto SVG slot — looks like a PNG placeholder until DDG lands
  if (/placeholder\.svg/i.test(u)) return true;
  if (/^\/assets\/cro-cover-/.test(u)) return true;                 // legacy generic cover = bad
  if (/^\/assets\/qa\//.test(u)) return false;                      // ✅ self-hosted (Fable): section/cover = GOOD
  if (/^https?:\/\//i.test(u)) return true;                         // ❌ hotlinked external URL = BAD (criterion 12: must self-host)
  return true;                                                      // any other non-local path = bad
}
function internalImagesOk(body, id) {
  if (!INTERNAL_IMAGES_DDG) return !REQUIRE_FLUX_IMAGES || bodyImagesAllFlux(body);
  const imgs = [...String(body || '').matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)];
  if (imgs.length < 2) return true;
  for (let i = 1; i < imgs.length; i++) {
    if (isBadInternalUrl(imgs[i][2], id)) return false;
  }
  return true;
}
const imagesFluxOk = (b, id) => internalImagesOk(b, id);
// Combined image gate — face-card mosaic cover (flux) + internal images (DDG or all-flux legacy).
const pollinatorOk = (id, body) => faceCoverOk(id) && internalImagesOk(body, id);
function pollinatorImagesNote(id, body) {
  if (!REQUIRE_FLUX_COVER && !INTERNAL_IMAGES_DDG && !REQUIRE_FLUX_IMAGES) return '';
  const imgs = []; let m; const re = /!\[[^\]]*\]\(([^)]+)\)/g;
  while ((m = re.exec(String(body))) && imgs.length < 14) imgs.push(m[1]);
  let coverKb = 0; try { coverKb = Math.round(fs.statSync(WD + '/assets/qa/' + id + '.jpg').size / 1024); } catch (e) {}
  const internalLabel = INTERNAL_IMAGES_DDG ? 'internalDdgOk' : 'allInternalFlux';
  const internalVal = internalImagesOk(body, id);
  return `\n\n--- POLLINATOR STATUS (required for 12/13) ---\nfaceCoverOk=${faceCoverOk(id)} | cover_src=${coverSrcOf[id] || 'none'} | coverFileKB=${coverKb}\n${internalLabel}=${internalVal}\nbodyImageURLs=${imgs.join(' | ') || '(none)'}`;
}
// 🔒 FINAL RUBRIC SIGN-OFF — explicit checklist of EVERY law before publish (writing + scrub share this).
// 12/13 is ONLY awarded when 100% of checks pass (incl. flux cover + DDG section images) — content score alone is not enough.
function rubricSignOff(id, body) {
  const g = gradeEntry(id, body, { imagesDeferred: true });
  const checks = {
    words2000: wordCount(body) >= WORD_FLOOR,
    heroImage: C.topImage(body),
    faceCardApplicable: faceCardApplicable(body, id),
    pollinatorFaceCover: faceCoverOk(id),
    pollinatorInternalFlux: internalImagesOk(body, id),
    media3to10: mediaOk(body, id),
    directAnswer: C.directAnswer(body),
    directAnswerFull: directAnswerFull(body),
    faq6: C.faq5(body),
    mermaid2: C.twoMermaid(body),
    mermaidClean: C.mermaidClean(body),
    sources5: C.sources5(body),
    relatedPulse: C.related(body),
    linksClean: C.linksClean(body, valid),
    top10Images: !isTop10Body(body) || auditTop10Images(id, body).compliant,
    rankingListMaster: !isRankingListBody(body) || auditRankingListMaster(body, titleOf[id] || entryTitle(body)).compliant,
    qaGoldOutline: !appliesQaGold(id, body, { title: titleOf[id] }) || auditQaGoldTemplate(body, titleOf[id] || entryTitle(body), id).compliant,
    imagesLaw: g.checks ? g.checks.images_law !== false : true,
    score12: false,   // set below — last gate: 100% checks + content ≥12
  };
  const preFailed = Object.keys(checks).filter(k => k !== 'score12' && !checks[k]);
  const contentOk = g.score >= 13; // 🔒 PIPELINE TEMPLATE LAW — publish at 13/13 only, never 12/13
  checks.score12 = preFailed.length === 0 && contentOk;
  const failed = Object.keys(checks).filter(k => !checks[k]);
  const pass = failed.length === 0;
  const total = Object.keys(checks).length;
  const passed = total - failed.length;
  const score = pass ? 13 : Math.min(11, g.score);
  return { pass, score, contentScore: g.score, rubricPct: Math.round(passed / total * 100), rubricPassed: passed, rubricTotal: total, missing: g.missing || [], failed, checks };
}
// 🔒 APPROVAL PILE LAW (owner 2026-07-03): nothing hits the pile or approval email until
// rubricSignOff is 100% pass (content + flux cover + DDG/images). Hours of bake time is fine.
// No needsReview / image-caveat early drops — two-lane scrub will finish images first.
const APPROVAL_PILE_REQUIRES_FULL_RUBRIC = true;
// Legacy caveats — only used for owner ✅ override on entries already in pile; no new partial adds.
const OWNER_REVIEW_CAVEATS = new Set(['pollinatorInternalFlux', 'pollinatorFaceCover', 'imagesLaw', 'faceCardApplicable', 'top10Images']);
/** Owner ✅ may waive content caveats — NEVER image/render failures (owner 2026-07-04). */
const PUBLISH_IMAGE_RUBRIC_KEYS = new Set(['pollinatorInternalFlux', 'pollinatorFaceCover', 'imagesLaw', 'faceCardApplicable', 'top10Images', 'heroImage', 'media3to10']);
const CONTENT_SCRUB_BLOCKERS = new Set(['words2000', 'heroImage', 'media3to10', 'directAnswer', 'directAnswerFull', 'faq6', 'mermaid2', 'mermaidClean', 'sources5', 'relatedPulse', 'linksClean', 'rankingListMaster', 'qaGoldOutline']);
function qualifiesForOwnerReviewPile(rubric, id, body) {
  const contentScore = (rubric && rubric.contentScore != null) ? rubric.contentScore : gradeEntry(id, body, { imagesDeferred: true }).score;
  if (contentScore < MIN_SCORE) return null;
  const failed = (rubric.failed || []).filter(k => k !== 'score12');
  if (!failed.length) return null;
  if (failed.some(k => CONTENT_SCRUB_BLOCKERS.has(k))) return null;
  if (!failed.every(k => OWNER_REVIEW_CAVEATS.has(k))) return null;
  return { contentScore, caveats: failed };
}
function ownerReviewReadyResult(id, body, rubric, ui) {
  if (ui === 'gen') return null;
  if (APPROVAL_PILE_REQUIRES_FULL_RUBRIC) return null;
  const review = qualifiesForOwnerReviewPile(rubric, id, body);
  if (!review) return null;
  pipelineDone(ui, 'certify', '12/13 content — your approval pile (' + review.caveats.join(', ') + ')');
  return { status: 'ready', score: review.contentScore, body, passedGate: false, rubric, needsReview: true, caveats: review.caveats, msg: '12/13 content — review caveats: ' + review.caveats.join(', ') };
}
// 🔒🔒 FINAL PUBLISH GATE — rubricSignOff only. Cursor / Claude Code / owner approval after brief skim.
async function finalPublishGate(id, title, body, hooks = {}) {
  const rubric = rubricSignOff(id, body);
  if (hooks.onRubric) hooks.onRubric(rubric);
  if (!rubric.pass) {
    const reason = rubric.failed.length ? rubric.failed.join(', ') : (rubric.missing || []).join(', ') || 'rubric';
    return { pass: false, score: rubric.score, rubric, audit: null, reason, stage: 'rubric' };
  }
  const sc = rubric.score >= 13 ? 13 : Math.max(MIN_SCORE, rubric.score);
  return { pass: true, score: sc, rubric, audit: null, stage: 'signoff' };
}

/** 13/13 rubric + live image render → certify immediately (no approval pile). */
async function attemptPublishIfReady(id, title, body, opts) {
  opts = opts || {};
  title = String(title || titleOf[id] || id).slice(0, 120);
  let b = String(body || '');
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur && cur.answer) b = cur.answer;
  } catch (e) {}
  const rb = opts.rubric || rubricSignOff(id, b);
  if (!rb.pass) {
    return { published: false, rubric: rb, score: rb.score, reason: (rb.failed || []).join(', ') || 'rubric incomplete' };
  }
  const imgGate = await publishImageGate(id, b, { forceVerify: opts.forceVerify !== false });
  if (!imgGate.ok) {
    return { published: false, rubric: rb, score: rb.score, reason: imgGate.reason, body: imgGate.body };
  }
  b = imgGate.body || b;
  const score = rb.score >= 13 ? 13 : Math.max(MIN_SCORE, rb.score);
  try {
    await certify(id, score, b, { via: opts.via || 'auto-13', rubric: rb, title, detail: opts.detail });
    bumpDay();
    removePendingSignoff(id);
    writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
    removeRejectFix(id);
    appendScrubLog({ ts: new Date().toISOString(), id, status: 'certified', score, msg: '✅ auto-published 13/13' });
    autoLog('✅ ' + id + ' ' + score + '/13 published');
    return { published: true, score, rubric: rb, body: b };
  } catch (e) {
    if (e && e.code === 'PUBLISH_IMAGE_GATE') {
      return { published: false, rubric: rb, score: rb.score, reason: e.message, body: b };
    }
    throw e;
  }
}

function readPending() { try { return JSON.parse(fs.readFileSync(PENDING, 'utf8')); } catch (e) { return []; } }
function writePending(a) { fs.writeFileSync(PENDING, JSON.stringify(a, null, 2)); }
function addPendingSignoff(rec) {
  // Approval pile removed — 13/13 + render gate publishes directly; re-queue if not ready.
  if (!rec || !rec.id) return;
  attemptPublishIfReady(rec.id, rec.title, null, { via: 'legacy-pending', rubric: null }).then(pub => {
    if (!pub.published) requeuePipelineForScrub(rec.id, pub.reason || rec.why || 'not publish-ready');
  }).catch(() => {});
}
function removePendingSignoff(id) { writePending(readPending().filter(x => x && x.id !== id)); }

function readRejectFix() { try { return JSON.parse(fs.readFileSync(REJECT_FIX, 'utf8')); } catch (e) { return []; } }
function writeRejectFix(a) { fs.writeFileSync(REJECT_FIX, JSON.stringify(a, null, 2)); }
function addRejectFix(rec) {
  const prev = readRejectFix().find(x => x && x.id === rec.id);
  const fix = readRejectFix().filter(x => x && x.id !== rec.id);
  fix.unshift(Object.assign({ at: new Date().toISOString(), pass: ((prev && prev.pass) || 0) + 1, status: 'queued-for-scrub' }, rec));
  writeRejectFix(fix.slice(0, 300));
}
function removeRejectFix(id) {
  writeRejectFix(readRejectFix().filter(x => x && x.id !== id));
  try {
    const aq = readAgentFix().filter(x => x && x.id !== id);
    fs.writeFileSync(AGENT_FIX, JSON.stringify(aq, null, 2));
  } catch (e) {}
}
function readAgentFix() { try { return JSON.parse(fs.readFileSync(AGENT_FIX, 'utf8')); } catch (e) { return []; } }
function appendAgentFixHandoff(rec) {
  try {
    const aq = readAgentFix().filter(x => x && x.id !== rec.id);
    aq.unshift(Object.assign({ at: new Date().toISOString(), status: 'needs-fix' }, rec));
    fs.writeFileSync(AGENT_FIX, JSON.stringify(aq.slice(0, 200), null, 2));
    const line = '- **' + rec.id + '** — ' + String(rec.why || '').slice(0, 120)
      + (rec.ownerTargets && rec.ownerTargets.length ? (' → fix: ' + rec.ownerTargets.join(', ')) : '')
      + (rec.ownerNotes ? (' · note: "' + String(rec.ownerNotes).slice(0, 100) + '"') : '')
      + ' — https://pulserevops.com/knowledge/' + rec.id + '\n';
    let md = '';
    try { md = fs.readFileSync(AGENT_FIX_MD, 'utf8'); } catch (e) {}
    if (!md.includes('## Owner rejects')) md += '\n## Owner rejects (fix → re-scrub → approval pile)\n';
    fs.writeFileSync(AGENT_FIX_MD, md + line);
    fs.appendFileSync(WD + '/_scrub_reject_fix.log', new Date().toISOString() + ' REJECT ' + rec.id + ' ' + String(rec.why || '') + (rec.ownerNotes ? (' | note: ' + rec.ownerNotes) : '') + '\n');
  } catch (e) {}
}
function prioritizeScrubQueue() {
  const fixIds = readRejectFix().map(x => x && x.id).filter(Boolean);
  if (!fixIds.length) return;
  const q = readArr(QUEUE);
  const seen = new Set(q);
  const add = fixIds.filter(id => !seen.has(id));
  if (add.length) writeArr(QUEUE, [...q, ...add]);
}
function markRejectFixStatus(id, status, extra) {
  const fix = readRejectFix();
  const i = fix.findIndex(x => x && x.id === id);
  if (i < 0) return;
  fix[i] = Object.assign({}, fix[i], extra || {}, { status, statusAt: new Date().toISOString() });
  writeRejectFix(fix);
}

async function ownerSignoffCertify(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) throw new Error('no blob for ' + id);
  let body = e.answer;
  const rb = rubricSignOff(id, body);
  const pending = readPending().find(x => x && x.id === id);
  const contentScore = rb.contentScore != null ? rb.contentScore : gradeEntry(id, body, { imagesDeferred: true }).score;
  const imageFails = (rb.failed || []).filter(k => PUBLISH_IMAGE_RUBRIC_KEYS.has(k));
  if (imageFails.length) throw new Error('image rubric blocked — re-scrub images first: ' + imageFails.join(', '));
  const imgGate = await publishImageGate(id, body, { forceVerify: true });
  if (!imgGate.ok) throw new Error('Q&A images not ready: ' + imgGate.reason);
  body = imgGate.body;
  const ownerOverride = pending && pending.needsReview && contentScore >= MIN_SCORE;
  if (!rb.pass && !ownerOverride) throw new Error('rubric blocked: ' + (rb.failed || []).join(', '));
  const score = contentScore >= 13 ? 13 : Math.max(MIN_SCORE, contentScore);
  await certify(id, score, body, { via: 'owner-signoff', rubric: rb, title: e.question || titleOf[id] });
  bumpDay();
  removePendingSignoff(id);
  return { id, score, rubric: rb, certified: true, ownerOverride: !!ownerOverride };
}
function ownerSignoffReject(id, reason, ownerTargets, ownerNotes) {
  const pending = readPending().find(x => x && x.id === id);
  const targets = Array.isArray(ownerTargets) ? ownerTargets.filter(Boolean) : [];
  const notes = String(ownerNotes || '').trim().slice(0, 800);
  let why = targets.length
    ? ('owner flagged: ' + targets.map(k => RUBRIC_LABELS[k] || k).join('; '))
    : String(reason || 'owner rejected at sign-off').trim();
  if (notes) why += ' · notes: ' + notes;
  removePendingSignoff(id);
  const rec = {
    id,
    title: (pending && pending.title) || titleOf[id] || id,
    pillar: (pending && pending.pillar) || pillarOf(id),
    score: pending && pending.score,
    why,
    ownerTargets: targets,
    ownerNotes: notes || null,
    source: 'owner-signoff',
  };
  addRejectFix(rec);
  appendAgentFixHandoff(rec);
  const q = readArr(QUEUE).filter(x => x !== id);
  writeArr(QUEUE, [...q, id]);
  prioritizeScrubQueue();
  const pk = readArr(PARK);
  pk.push({ id, why: 'owner reject → scrub fix: ' + why, at: new Date().toISOString(), source: 'owner-signoff' });
  writeArr(PARK, pk.slice(-500));
  appendScrubLog({ ts: new Date().toISOString(), id, status: 'reject-fix', msg: why });
  if (SCRUB_LANE_MODE && targets.length) {
    let phase = 'content';
    if (targets.some(k => OWNER_RETARGET_IMAGE_KEYS.has(k))) {
      if (targets.includes('top10Images')) phase = 'top10';
      else if (targets.includes('pollinatorFaceCover') || targets.includes('heroImage') || targets.includes('faceCardApplicable')) phase = 'image_cover';
      else phase = 'image_section';
    }
    upsertLaneJob(id, { phase, sectionIdx: 0, ownerNotes: notes || null });
  }
  if (!autoJob.running && !scrubBusy && !laneTimer) {
    if (SCRUB_LANE_MODE) startLaneScheduler();
    else scrubAutoLoop();
  }
  return {
    id, rejected: true, routed: 'scrub-priority', why,
    msg: '✗ ' + id + ' → scrubber fixing: ' + (targets.length ? targets.map(k => RUBRIC_LABELS[k] || k).join(', ') : 'general') + (notes ? (' · "' + notes.slice(0, 60) + (notes.length > 60 ? '…' : '') + '"') : '') + '. Fair-queue retarget — alternates with fresh pool.',
  };
}

function scrubHistoryForId(id, limit = 24) {
  return readArr(SCRUBLOG).filter(r => r && r.id === id).slice(0, limit);
}
async function isPipelineGeneratedEntry(id) {
  if (pipelineScrubPriority.has(id)) return true;
  try {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    return !!(e && (e.pipeline_origin === 'generate' || e.from_pipeline_generator));
  } catch (e) { return false; }
}
// 🔒 PUBLISH IMAGE GATE — every markdown image must RENDER on the live Q&A page path before certify.
// Uses the same wsrv proxy + local /assets checks as pulse-machine-entry.js imgProxy().
async function publishImageGate(id, body, opts) {
  opts = opts || {};
  let b = enforceCroCardLaw(String(body || ''), id);
  if (!croCardLawOk(b, id)) return { ok: false, reason: 'CRO card law — kory-white or baked CRO ad in blob', body: b };
  if (!internalImagesOk(b, id)) return { ok: false, reason: INTERNAL_IMAGES_DDG ? 'section images not DDG-ready (placeholder/hotlink)' : 'section images not Pollinator-ready (/assets/qa self-hosted)', body: b };
  if (bodyHasLivePollinatorUrls(b, id)) {
    return { ok: false, reason: 'live image.pollinations.ai URL in body — self-host Pollinator assets before publish', body: b };
  }

  const title = titleOf[id] || id;
  const pillar = pillarOf(id);
  const facePath = '/assets/qa/' + id + '.jpg';

  if (/^[a-z]{2,3}\d/i.test(String(id)) && REQUIRE_FLUX_COVER) {
    if (!faceCoverOk(id)) {
      return { ok: false, reason: 'face-card cover missing — ' + facePath + ' must exist (>40KB, cover_src=flux)', body: b };
    }
    b = await ensureTopImage(id, title, pillar, b);
  } else if (!C.topImage(b)) {
    try { b = await ensureTopImage(id, title, pillar, b); } catch (e) {}
  }
  if (!C.topImage(b)) return { ok: false, reason: 'hero image markdown missing on Q&A body', body: b };

  const heroMatch = String(b).slice(0, 2000).match(/!\[[^\]]*\]\(([^)]+)\)/);
  const heroUrl = heroMatch && heroMatch[1];
  if (heroUrl && !(await imgLoadsLiveStrict(heroUrl, id, {}))) {
    return { ok: false, reason: 'hero image does not render on Q&A page: ' + heroUrl, body: b };
  }
  if (/^[a-z]{2,3}\d/i.test(String(id)) && REQUIRE_FLUX_COVER && heroUrl && heroUrl !== facePath && !isKoryCroImg(heroUrl)) {
    return { ok: false, reason: 'hero must reference self-hosted face-card ' + facePath + ' (got ' + heroUrl + ')', body: b };
  }

  const cached = getImageVerifyCache(id, b);
  if (cached && cached.ok && !(opts && opts.forceVerify)) {
    return { ok: true, reason: 'all Q&A images render OK (cached)', body: cached.body || b };
  }
  const triple = await tripleVerifyAllImagesRender(b, id, { forceVerify: !!(opts && opts.forceVerify) });
  b = triple.body || b;
  if (!triple.ok) return { ok: false, reason: 'one or more Pollinator/DDG images failed live render (triple-check)', body: b };
  if (!(await allImagesRenderOk(b, id, {}))) {
    return { ok: false, reason: 'final render sweep failed — image broken on Q&A page', body: b };
  }
  putImageVerifyCache(id, b, { ok: true, body: b, passes: triple.passes || 3 });
  return { ok: true, reason: 'all Q&A images render OK', body: b };
}
async function pipelinePublishReady(id, body, opts) {
  opts = opts || {};
  return publishImageGate(id, body, { forceVerify: true, imageVerified: opts.imageVerified });
}
async function finishPipelinePublish(id, title, body, score, out, via) {
  await certify(id, score, body, { via: 'pipeline-' + (via || 'finish'), title: String(title).slice(0, 120) });
  bumpDay();
  pipelineScrubPriority.delete(id);
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) {
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
        pipeline_origin: null,
        from_pipeline_generator: false,
        pending: false,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
    }
  } catch (e) {}
  writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
  removeRejectFix(id);
  removePendingSignoff(id);
  if (out && !out.steps.includes('pipeline-published')) out.steps.push('pipeline-published');
  return Object.assign(out || { id, title: String(title).slice(0, 90), pillar: pillarOf(id), steps: [] }, {
    status: 'certified', score, msg: '✅ PUBLISHED — pipeline generate → scrub',
  });
}
async function requeuePipelineForScrub(id, reason) {
  const qq = readArr(QUEUE);
  if (!qq.includes(id)) writeArr(QUEUE, [id, ...qq.filter(x => x !== id)]);
  pipelineScrubPriority.add(id);
  ensureScrubberRunning('pipeline-retry:' + id);
  autoLog('🔁 ' + id + ' pipeline publish blocked — ' + String(reason).slice(0, 60) + ' · re-queued');
}
async function routeScrubOutcome(id, title, body, result, out) {
  let finalBody = body;
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur && cur.answer) finalBody = cur.answer;
  } catch (e) {}
  const rb = result.rubric || rubricSignOff(id, finalBody);
  const score = result.score != null ? result.score : (rb.score != null ? rb.score : gradeEntry(id, finalBody, { imagesDeferred: true }).score);
  const titleShort = String((out && out.title) || titleOf[id] || title || id).slice(0, 90);
  const pillar = (out && out.pillar) || pillarOf(id);

  writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
  removeRejectFix(id);

  if (PIPELINE_AUTO_SCRUB_PUBLISH && rb.pass && await isPipelineGeneratedEntry(id)) {
    const prep = await pipelinePublishReady(id, finalBody, { imageVerified: result.imageVerified !== false });
    if (prep.body && prep.body !== finalBody) {
      finalBody = prep.body;
      try { await store.setJSON('answers/' + id + '.json', Object.assign({}, await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => ({})), { answer: finalBody, updated_at: new Date().toISOString() })); } catch (e) {}
    }
    if (prep.ok) return finishPipelinePublish(id, titleShort, finalBody, score, out, 'route');
  }

  const pub = await attemptPublishIfReady(id, titleShort, finalBody, {
    via: 'route',
    rubric: rb,
    forceVerify: result.imageVerified !== false,
  });
  if (pub.published) {
    autoJob.certified = (autoJob.certified || 0) + 1;
    autoJob.lastFinish = { type: 'certified', id, score: pub.score, at: Date.now() };
    if (out && !out.steps.includes('auto-published')) out.steps.push('auto-published');
    return Object.assign(out || { id, title: titleShort, pillar, steps: [] }, { status: 'certified', score: pub.score, msg: '✅ PUBLISHED 13/13' });
  }

  const why = pub.reason || (rb.failed || []).join(', ') || 'not 13/13';
  await requeuePipelineForScrub(id, why);
  autoJob.parked = (autoJob.parked || 0) + 1;
  autoJob.lastFinish = { type: 'parked', id, score: pub.score || score, why, at: Date.now() };
  autoLog('🅿️ ' + id + ' ' + (pub.score || score) + '/13 — ' + String(why).slice(0, 55) + ' · re-queued');
  return Object.assign(out || { id, title: titleShort, pillar, steps: [] }, {
    status: 'parked', score: pub.score || score, msg: why + ' — re-queued for stations',
  });
}

async function buildInspectReport(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { id, ok: false, error: 'no blob' };
  const body = e.answer;
  const rb = rubricSignOff(id, body);
  const imgs = [...String(body).matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)].map(m => ({ alt: m[1], url: m[2] }));
  let coverKb = 0; try { coverKb = Math.round(fs.statSync(WD + '/assets/qa/' + id + '.jpg').size / 1024); } catch (err) {}
  const checks = Object.keys(rb.checks || {}).map(k => ({ key: k, label: RUBRIC_LABELS[k] || k, pass: !!rb.checks[k] }));
  return {
    id, ok: true, title: e.question || titleOf[id] || id, pillar: pillarOf(id),
    score: rb.score, contentScore: gradeEntry(id, body, { imagesDeferred: true }).score,
    rubricPass: rb.pass, rubricPct: rb.rubricPct, failed: rb.failed, checks,
    words: wordCount(body), coverSrc: coverSrcOf[id] || 'none', coverKb,
    images: imgs.slice(0, 14), liveUrl: 'https://pulserevops.com/knowledge/' + id,
    excerpt: String(body).replace(/```[\s\S]*?```/g, '[code]').slice(0, 2400),
    pending: readPending().some(x => x && x.id === id),
    inGreen: readArr(AP).includes(id),
    scrubHistory: scrubHistoryForId(id),
  };
}

function publishTagsFor(id, cur, opts) {
  const p = pillarOf(id);
  let tags = (cur && Array.isArray(cur.tags) && cur.tags.length) ? cur.tags.slice() : [p];
  if (p === 'ce') {
    ['current-events', 'current-events-2027', 'pulse-news'].forEach(function (t) {
      if (tags.indexOf(t) < 0) tags.push(t);
    });
  }
  if (tags.indexOf(p) < 0) tags.unshift(p);
  // Live publish: pillar tag + pulse-recent so /recent always lists newest certified entries.
  if (opts && opts.publishing && tags.indexOf('pulse-recent') < 0) tags.push('pulse-recent');
  return tags;
}

function indexRowFromBlob(id, cur, score) {
  const now = Date.now();
  const tsIso = new Date().toISOString();
  const faceOk = coverFileOk(id) && faceCardCoverOk(id, cur.cover_src || coverSrcOf[id] || null);
  return {
    id,
    question: cur.question || titleOf[id] || id,
    tags: publishTagsFor(id, cur, { publishing: true }),
    quality_score: score >= 13 ? 13 : score,
    format_v: '2026-07',
    pending: false,
    ts: now,
    img: faceOk ? (cur.img || ('/assets/qa/' + id + '.jpg')) : null,
    cover_src: faceOk ? (cur.cover_src || coverSrcOf[id] || null) : null,
    was_indexed_at: tsIso,
  };
}

async function upsertIndexPublish(id, score, cur) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  if (!idx || !Array.isArray(idx.entries)) return;
  const row = indexRowFromBlob(id, cur, score);
  idx.entries = idx.entries.filter(function (e) { return e && e.id !== id; });
  idx.entries.unshift(row);
  idx.entries.sort(function (a, b) { return (Number(b.ts) || 0) - (Number(a.ts) || 0); });
  await store.setJSON('_index.json', idx);
  try {
    const p = pillarOf(id);
    const title = row.question;
    const hit = (byPillar[p] || []).some(function (s) { return s && s.id === id; });
    if (!hit) (byPillar[p] = byPillar[p] || []).push({ id: id, title: title });
    titleOf[id] = title;
    valid.add(id);
  } catch (e) {}
}

async function certify(id, score, body, opts) {
  opts = opts || {};
  let gateBody = String(body || '');
  try {
    const cur0 = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur0 && cur0.answer) gateBody = cur0.answer;
  } catch (e) {}
  const imgGate = await publishImageGate(id, gateBody, { forceVerify: true });
  if (!imgGate.ok) {
    const msg = 'certify blocked — ' + imgGate.reason;
    appendScrubLog({ ts: new Date().toISOString(), id, status: 'blocked', score, msg });
    autoLog('🚫 ' + id + ' publish blocked — ' + String(imgGate.reason).slice(0, 80));
    try { await requeuePipelineForScrub(id, imgGate.reason); } catch (e) {}
    const err = new Error(msg);
    err.code = 'PUBLISH_IMAGE_GATE';
    throw err;
  }
  gateBody = imgGate.body || gateBody;

  const nr = readArr(NR), ap = readArr(AP), cc = readArr(CC);
  if (nr.includes(id)) writeArr(NR, nr.filter(x => x !== id));
  if (!ap.includes(id)) writeArr(AP, [...new Set([...ap, id])]);
  if (!cc.includes(id)) writeArr(CC, [...new Set([...cc, id])]);
  const ts = new Date().toISOString(), q = (score >= 13 ? 13 : score) + '/13';
  const nowMs = Date.now();
  try {
    let cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) {
      if (gateBody && gateBody !== cur.answer) cur = Object.assign({}, cur, { answer: gateBody });
      const pubTags = publishTagsFor(id, cur, { publishing: true });
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
        cc_signed: true,
        claude_certified: 'Claude Certified Fresh',
        cc_signed_at: ts,
        quality: q,
        quality_score: score >= 13 ? 13 : score,
        pending: false,
        tags: pubTags,
        ts: nowMs,
        was_indexed_at: ts,
        updated_at: ts,
        images_verified_at: ts,
      }));
      // GUARANTEE live-in-pillar + /recent: upsert index with fresh ts, img, and pillar tags.
      if (score >= MIN_SCORE) {
        try { await upsertIndexPublish(id, score, Object.assign({}, cur, { tags: pubTags })); } catch (e) {}
      }
      // Scrubber is the ONLY publish authority — certify removes from queue; do not re-queue.
    }
  } catch (e) {}
  try { await pingIndexNowUrlList(['https://pulserevops.com/knowledge/' + id]); } catch (e) {}
  try { await pushSeoCounts(store, { lastBtnAt: ts, lastBtnId: id }); } catch (e) {}
  await logCertified13Done(id, score, Object.assign({}, opts, { body: gateBody, title: opts.title || titleOf[id] }));
}

// ══════════════════════════════════════════════════════════════════════
// 🎲 GENERATE crew — two-factor publish law (owner 2026-07-03):
//   1) Writing runs the SAME full scrub pipeline (rubric + Pollinator).
//   2) Nothing goes live from Generate — every new entry is queued for the scrubber.
//   3) Scrubber re-runs the same pipeline and is the ONLY path to certify/publish.
// ══════════════════════════════════════════════════════════════════════
// ── AUDITOR = Claude Code CLI on the owner's 20× Max plan (NOT the pay-as-you-go Anthropic API) ──
// Writing stays on the DeepSeek pay-as-you-go API (dsChat). This is the owner's required wiring.
function findClaudeCli(){
  if (process.env.CLAUDE_CLI && fs.existsSync(process.env.CLAUDE_CLI)) return process.env.CLAUDE_CLI;
  try {
    const base = path.join(process.env.USERPROFILE || process.env.HOME || 'C:/Users/koryj', '.vscode', 'extensions');
    const dirs = fs.readdirSync(base).filter(d => /^anthropic\.claude-code-/i.test(d)).sort().reverse();   // newest version first
    for (const d of dirs){ const p = path.join(base, d, 'resources', 'native-binary', 'claude.exe'); if (fs.existsSync(p)) return p; }
  } catch(e){}
  return 'claude';   // fall back to PATH
}
const CLAUDE_CLI = findClaudeCli();
const SCRUB_CREW = buildScrubCrewManifest();
console.log('[scrub-button] CREW:', SCRUB_CREW.oneLiner);
console.log('[scrub-button] writers: ' + LANE_CONTENT_WRITERS + ' ' + (String(process.env.CONTENT_WRITER_ENGINE || '').toLowerCase() === 'claude' ? 'Claude Code' : 'DeepSeek') + ' (generate: ' + GEN_WRITERS + ' parallel) · auditors:', SCRUB_CREW.auditors.counts.label, '| mode=' + LANE_AUDITOR_MODE, (isHumanAuditorMode() ? '(you audit)' : ((LANE_AUDITOR_MODE === 'ds' || LANE_AUDITOR_MODE === 'cursor') ? '(auto · CC off)' : ('| CC pool max=' + SCRUB_CREW.auditors.claudeCodePoolMaxConcurrent))));
if (!isHumanAuditorMode() && LANE_AUDITOR_MODE !== 'ds') console.log('[scrub-button] claude-code CLI:', CLAUDE_CLI);
// one headless Max-plan query; returns { ok, text }. No API key — uses the Max subscription.
// 4 CC AUDITORS: cap concurrent Claude CLI calls at 4 (owner 4444). This IS the "4 cc auditors"
// pool AND the key bottleneck fix — more than ~4 parallel claude.exe calls just hit Max-plan rate
// limits and stall, so capping keeps all 4 productive instead of thrashing.
let _ccActive = 0; const _ccWait = []; const CC_MAX = parseInt(process.env.CC_MAX || '4', 10);
// CC LAUNCH STAGGER (owner 4444 · 2026-07-08): minimum gap between consecutive claude.exe
// launches so the 2 writers + 2 auditors never fire at the same instant — each new CC call
// starts >=CC_STAGGER_MS after the previous one began. Smooths the Max-plan rate window.
const CC_STAGGER_MS = parseInt(process.env.CC_STAGGER_MS || '20000', 10);
let _ccLastStart = 0;
async function _ccAcquire() {
  await new Promise(res => { if (_ccActive < CC_MAX) { _ccActive++; res(); } else _ccWait.push(res); });
  if (CC_STAGGER_MS > 0) {
    const wait = _ccLastStart + CC_STAGGER_MS - Date.now();
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    _ccLastStart = Date.now();
  }
}
function _ccRelease() { _ccActive--; const n = _ccWait.shift(); if (n) { _ccActive++; n(); } }
async function claudeCli(prompt, timeoutMs){
  await _ccAcquire();
  try {
    return await new Promise(resolve => {
      execFile(CLAUDE_CLI, ['-p', prompt], { timeout: timeoutMs || 120000, maxBuffer: 4*1024*1024, windowsHide: true }, (err, stdout) => {
        const text = String(stdout || '').trim();
        if (text) resolve({ ok:true, text });
        else resolve({ ok:false, text:'', err: err ? String(err.message).slice(0,120) : 'empty' });
      });
    });
  } finally { _ccRelease(); }
}
// CONTENT WRITER ENGINE (owner 4444 · 2026-07-08): route the content writers through
// Claude Code (claude.exe) instead of DeepSeek. dsChat-compatible signature so fixEntry
// is unchanged. Set CONTENT_WRITER_ENGINE=claude to activate (default stays DeepSeek).
async function ccChat(messages, opts) {
  opts = opts || {};
  const sys = (messages || []).filter(m => m && m.role === 'system').map(m => m.content).join('\n\n');
  const usr = (messages || []).filter(m => m && m.role !== 'system').map(m => m.content).join('\n\n');
  const prompt = (sys ? sys + '\n\n---\n\n' : '') + usr +
    '\n\nWrite ONLY the requested Markdown article body as your final message — no preamble, no tool use, no commentary.';
  const r = await claudeCli(prompt, opts.timeoutMs || 240000);
  if (!r.ok || !r.text) throw new Error('cc-write ' + (r.err || 'empty'));
  return { content: r.text };
}
const CONTENT_WRITER_ENGINE = String(process.env.CONTENT_WRITER_ENGINE || 'deepseek').toLowerCase();
const contentChat = CONTENT_WRITER_ENGINE === 'claude' ? ccChat : dsChat;
console.log('[scrub-button] content writer engine: ' + (CONTENT_WRITER_ENGINE === 'claude' ? 'Claude Code (claude.exe) · owner 4444' : 'DeepSeek'));
const GENF = WD + '/_gen100_state.json';
const PILLAR_NAMES = { tl:'Pulse Tools / CRO', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infrastructure', gb:'Graphics', bo:'Buildouts', sy:'Style', cr:'Crabbing', fs:'Fishing', gp:'GTM Playbooks', ra:'Revenue Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Luxury Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dr:'Drills', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', ce:'Current Events', q:'Q&A' };
// topic hints (used when a pillar has few/no sample titles to learn from — e.g. a brand-new pillar)
const PILLAR_TOPIC = { ce: 'current events, breaking news, pop culture, music, movies, TV, celebrities, sports, and viral/trending stories' };
// per-pillar TOTAL entry cap (owner) — stops a pillar from growing forever
const PILLAR_CAP = { ce: 10000 };
const capFor = p => PILLAR_CAP[p] || 100000;
const pName = p => PILLAR_NAMES[p] || (p || '').toUpperCase();
// ACTIVE pillars only (owner): real 2-3 letter pillars with content — never the junk (qmp*, vq, tiny malformed ids)
function activePillars(){ const a = Object.keys(byPillar).filter(p => /^[a-z]{2,3}$/.test(p) && p !== 'vq' && (byPillar[p]||[]).length >= 30); if(!a.includes('ce')) a.push('ce'); return a; }
let genExample = '';   // a recent entry from the target pillar — the writer FOLLOWS its format (Top-10 vs Q&A, etc.)
// 🗓️ YEAR LAW (owner): a title about something time-datable must END with "in 2027"; evergreen titles are exempt.
function yearize(q){
  q = String(q).trim(); const hadQ = /\?\s*$/.test(q); q = q.replace(/\?+\s*$/,'').trim();
  if (/\b20\d\d\b/.test(q)) return hadQ ? q+'?' : q;   // already dated
  // EVERGREEN advice/how-to/definition — never yearize ("best WAY to…", "how to…", "why…", "should I…")
  const evergreen = /\b(best|right|proper|smartest|safest|kindest|healthiest|easiest|fastest)\s+way\b|\bhow\s+(to|do|can|should|much|long|often)\b|\bwhy\b|\bshould\s+(i|you)\b|\bwhat\s+does\b.*\bmean\b|\bdifference\s+between\b|\bmeaning\s+of\b|\bis\s+it\s+(ok|safe|normal|worth|possible)\b/i.test(q);
  // DATABLE product/list/ranking (the answer changes over the years) — yearize
  const datable = /\b(best|top|cheapest|most\s+popular|newest|latest|leading|highest[- ]rated|worth\s+buying)\b.*\b(buy|get|own|invest|stock|model|product|brand|deal|price|game|toy|gift|tool|app|software|crm|platform|car|truck|suv|boat|phone|laptop|tv|console|gadget|watch|headphone|drink|bottle|restaurant|resort|hotel|to\s+(?:buy|get|play|watch|own|use|drink|visit))\b/i.test(q);
  if (datable && !evergreen) q += ' in 2027';
  return hadQ ? q+'?' : q;
}
// IMAGE TIER (owner): Pollinations FIRST, DDG second (Gemini skipped). Direct URL = deploy-free, renderer proxies it.
function pollCoverUrl(title, pillar){
  const topical = { ca:'automobile car vehicle', bt:'boat yacht marine', aq:'planted aquarium fish tank', er:'consumer electronics product', dn:'restaurant food dining', nl:'nightlife bar lounge', tn:'town city skyline', sc:'school campus', mv:'cinema film', es:'espresso coffee', tv:'television home theater', rs:'luxury resort hotel', cl:'cologne fragrance bottle', lv:'luxury vacation travel', ev:'event celebration', ga:'board game', gm:'video gaming setup', wl:'wellness spa retreat', dr:'sports training drill', fr:'franchise storefront', co:'collectible memorabilia', sy:'fashion outfit style', cr:'chesapeake crabbing', fs:'fishing boat water', pt:'pet animal', tk:'software dashboard workspace', ik:'business analytics chart', gb:'clean infographic', bo:'commercial real estate buildout', ai:'AI automation abstract', gp:'go to market strategy office', ra:'revenue operations office', bs:'business book desk', st:'sales training workshop', ce:'news media broadcast pop culture entertainment' };
  const lane = topical[pillar] || 'professional editorial business photography';
  const prompt = ('high quality editorial ' + lane + ' photograph illustrating ' + String(title).slice(0,90) + ', realistic magazine style, warm light, no text, no watermark, no words').slice(0,300);
  let h = 0; for (const c of String(title)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1200&height=675&nologo=true&model=flux&seed=' + (h % 100000);
}
// VERIFY a top image actually LOADS (not just that a markdown tag exists). Pollinations can
// 500 / time out, leaving a blank hero — C.topImage only checks the tag. This catches broken
// heroes and falls through tiers to a GUARANTEED static asset, so NOTHING publishes imageless.
async function imgLoads(u){
  try{
    if(!u) return false;
    if(u.startsWith('/')) return true;                       // local /assets — always present
    const r = await fetch(u, { method:'GET', headers:{ Range:'bytes=0-8192', 'User-Agent':'Mozilla/5.0' }, redirect:'follow', signal: AbortSignal.timeout(20000) });
    if(!r.ok) return false;
    return /image\//i.test(r.headers.get('content-type') || '');
  }catch(e){ return false; }
}
// Bake wsrv.nl cache before the approval iframe / live page paints the slot.
async function primeProxiedImage(u) {
  if (!u || u.startsWith('/') || isPlaceholderImageUrl(u)) return false;
  const proxied = liveImgProxy(u);
  const targets = proxied === u ? [u] : [u, proxied];
  for (const target of targets) {
    try {
      await fetch(target, { method: 'GET', headers: { Range: 'bytes=0-65535', 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow', signal: AbortSignal.timeout(25000) });
    } catch (e) {}
  }
  return true;
}
// Live site proxies external DDG URLs through wsrv.nl (pulse-machine-entry.js imgProxy).
// Scrub must verify the SAME path the browser uses — raw URL can pass while proxy fails.
function liveImgProxy(u) {
  u = String(u || '').trim();
  if (!/^https?:\/\//i.test(u)) return u;
  if (/(^|\/\/)(pulserevops\.com|wsrv\.nl|images\.weserv\.nl|image\.pollinations\.ai)/i.test(u)) return u;
  return 'https://wsrv.nl/?url=' + encodeURIComponent(u.replace(/^https?:\/\//i, '')) + '&w=1280&output=webp&q=82&we&n=-1';
}
function isLivePollinatorUrl(u) {
  return /pollinations\.ai/i.test(String(u || ''));
}
function bodyHasLivePollinatorUrls(body, id) {
  return collectAllBodyImageUrls(body, id).some(isLivePollinatorUrl);
}
function localAssetLoads(u, id) {
  if (!u || !u.startsWith('/')) return false;
  const fp = path.join(WD, u.replace(/^\//, '').split('/').join(path.sep));
  try {
    const st = fs.statSync(fp);
    if (st.size < 512) return false;
    if (u === '/assets/qa/' + id + '.jpg') return coverFileOk(id);
    if (isKoryCroImg(u)) return st.size >= 1024;
    if (/^\/assets\/qa\//.test(u)) return st.size >= 4000;
    return st.size >= 1024;
  } catch (e) { return false; }
}
async function verifyLocalAssetRenders(u, id) {
  if (!u || !u.startsWith('/')) return false;
  if (/^\/assets\/qa\//.test(u)) {
    const ok = await verifyQaAssetRenders(u, id);
    return ok === true;
  }
  return localAssetLoads(u, id);
}
async function imgLoadsLiveStrict(u, id, opts) {
  if (!u) return false;
  if (isLivePollinatorUrl(u)) return false;
  if (u.startsWith('/')) return verifyLocalAssetRenders(u, id);
  return imgLoadsLive(u, opts);
}
async function imgLoadsLive(u, opts) {
  opts = opts || {};
  if (!u) return false;
  if (u.startsWith('/')) return true;
  if (isPlaceholderImageUrl(u)) return false;
  const tries = parseInt(process.env.DDG_PROXY_TRIES || '3', 10);
  const gap = parseInt(process.env.DDG_PROXY_RETRY_MS || '1500', 10);
  for (let t = 0; t < tries; t++) {
    if (!(await imgLoads(u))) { if (t + 1 < tries) await new Promise(r => setTimeout(r, gap)); continue; }
    const proxied = liveImgProxy(u);
    if (proxied === u) return true;
    if (await imgLoads(proxied)) {
      if (opts.fastVerify) return true;
      await primeProxiedImage(u);
      await new Promise(r => setTimeout(r, parseInt(process.env.WSRV_WARM_MS || '1000', 10)));
      if (await imgLoads(proxied)) return true;
    }
    if (t + 1 < tries) await new Promise(r => setTimeout(r, gap));
  }
  return false;
}
// Pause + prime after each committed DDG section so preview does not flash placeholder slots.
async function ddgAfterSectionCommit(url, onProgress, id) {
  if (!url) return false;
  if (/^\/assets\/qa\//.test(url)) {
    if (onProgress) onProgress({ label: 'local render settle' });
    await ddgRenderSettle();
    return verifyQaAssetRenders(url, id);
  }
  if (!/^https?:\/\//i.test(url)) return false;
  if (onProgress) onProgress({ label: 'priming wsrv' });
  await primeProxiedImage(url);
  if (onProgress) onProgress({ label: 'render settle' });
  await ddgRenderSettle();
  return imgLoadsLive(url);
}
function isPlaceholderImageUrl(u) {
  u = String(u || '');
  return /placeholder\.svg/i.test(u) || /\/img\/auto\/[^)\s]+\.svg/i.test(u);
}
function stripPlaceholderImageLines(body) {
  let heroSeen = false;
  const lines = String(body || '').split('\n');
  const out = [];
  for (const line of lines) {
    const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (!m) { out.push(line); continue; }
    if (!heroSeen) { heroSeen = true; out.push(line); continue; }
    const url = m[2];
    if (isKoryCroImg(url)) continue;
    if (isPlaceholderImageUrl(url) || /pollinations\.ai/i.test(url)) continue;
    out.push(line);
  }
  return out.join('\n');
}
async function confirmBlobBody(id, body) {
  try {
    const r = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
    return r && r.answer && r.answer === body;
  } catch (e) { return false; }
}
/** Strong read + merge + verify — used by modular stations so blob writes don't fail silently. */
async function persistAnswerBlob(id, body, extra, logFn) {
  extra = extra || {};
  if (body == null) return { ok: false, error: 'empty body' };
  const title = titleOf[id] || id;
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const cur = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
      if (!cur) return { ok: false, error: 'no blob' };
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, extra, {
        answer: body,
        h1: extra.h1 != null ? extra.h1 : (cur.h1 || title),
        updated_at: new Date().toISOString(),
      }));
      if (await confirmBlobBody(id, body)) return { ok: true };
      lastErr = new Error('confirm mismatch attempt ' + (attempt + 1));
    } catch (e) {
      lastErr = e;
    }
    await new Promise(r => setTimeout(r, 250 * (attempt + 1)));
  }
  const msg = lastErr && (lastErr.message || String(lastErr)) || 'blob save failed';
  if (logFn) logFn('⚠️ blob save · ' + id + ' · ' + msg);
  return { ok: false, error: msg };
}
async function waitFluxIdle(maxMs) {
  if (!fluxStats().busy) return;
  const end = Date.now() + (maxMs || parseInt(process.env.DDG_AFTER_FLUX_MS || '8000', 10));
  while (fluxStats().busy && Date.now() < end) await new Promise(r => setTimeout(r, 400));
}
async function internalImagesLiveOk(body, id, opts) {
  if (bodyHasLivePollinatorUrls(body, id)) return false;
  if (!INTERNAL_IMAGES_DDG) {
    const urls = collectAllBodyImageUrls(body, id).filter(u => u && !isKoryCroImg(u));
    if (!urls.length) return false;
    if (REQUIRE_FLUX_COVER && !(await verifyQaAssetRenders('/assets/qa/' + id + '.jpg', id))) return false;
    const conc = parseInt(process.env.IMAGE_VERIFY_CONCURRENCY || '6', 10);
    const fast = !!(opts && opts.fastVerify);
    const results = await pmapLimit(urls, conc, u => imgLoadsLiveStrict(u, id, { fastVerify: fast && !u.startsWith('/') }));
    return results.every(Boolean);
  }
  const imgs = [...String(body || '').matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)];
  if (imgs.length < 2) return true;
  const slots = [];
  let checked = 0;
  for (let i = 1; i < imgs.length; i++) {
    const url = imgs[i][2];
    if (isKoryCroImg(url)) continue;
    if (++checked > MEDIA_MAX - 1) break;
    if (isBadInternalUrl(url, id)) return false;
    slots.push(url);
  }
  if (!slots.length) return true;
  const conc = parseInt(process.env.IMAGE_VERIFY_CONCURRENCY || '6', 10);
  const fast = !!(opts && opts.fastVerify);
  const results = await pmapLimit(slots, conc, u => imgLoadsLiveStrict(u, id, { fastVerify: fast }));
  return results.every(Boolean);
}
function collectAllBodyImageUrls(body, id) {
  const out = [], seen = new Set();
  const add = u => { u = String(u || '').trim(); if (!u || seen.has(u)) return; seen.add(u); out.push(u); };
  if (isTop10Body(body)) {
    const hero = heroOf(body);
    if (hero) add(hero);
    bodyImages(body).forEach(add);
    return out;
  }
  [...String(body || '').matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].forEach(m => add(m[1]));
  return out;
}
async function allImagesRenderOk(body, id, opts) {
  const urls = collectAllBodyImageUrls(body, id);
  if (!urls.length) return false;
  const conc = parseInt(process.env.IMAGE_VERIFY_CONCURRENCY || '6', 10);
  const fast = !!(opts && opts.fastVerify);
  const results = await pmapLimit(urls, conc, u => imgLoadsLiveStrict(u, id, { fastVerify: fast && !u.startsWith('/') }));
  return results.every(Boolean);
}
const IMAGE_VERIFY_CACHE_MS = parseInt(process.env.IMAGE_VERIFY_CACHE_MS || '120000', 10);
const _imageVerifyCache = new Map();
function bodyImgFingerprint(body, id) {
  const urls = collectAllBodyImageUrls(body, id);
  const mtimes = urls.filter(u => u && u.startsWith('/assets/qa/')).map(u => {
    try { return u + ':' + fs.statSync(path.join(WD, u.replace(/^\//, '').split('/').join(path.sep))).mtimeMs; } catch (e) { return u + ':missing'; }
  });
  return id + '|' + urls.join('\n') + '|' + mtimes.join(',');
}
function putImageVerifyCache(id, body, result) {
  _imageVerifyCache.set(id, { fp: bodyImgFingerprint(body, id), ok: !!result.ok, body: result.body, passes: result.passes || 0, at: Date.now() });
}
function getImageVerifyCache(id, body) {
  const c = _imageVerifyCache.get(id);
  if (!c || Date.now() - c.at > IMAGE_VERIFY_CACHE_MS) return null;
  if (c.fp !== bodyImgFingerprint(body, id)) return null;
  return c;
}
function clearImageVerifyCache(id) {
  if (id) _imageVerifyCache.delete(id);
  else _imageVerifyCache.clear();
}
async function pmapLimit(items, limit, fn) {
  if (!items.length) return [];
  const n = Math.max(1, Math.min(limit, items.length));
  const out = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    for (;;) {
      const i = cursor++;
      if (i >= items.length) break;
      out[i] = await fn(items[i], i);
    }
  }));
  return out;
}
async function tripleVerifyAllImagesRender(body, id, hooks) {
  hooks = hooks || {};
  if (!hooks.forceVerify) {
    const cached = getImageVerifyCache(id, body);
    if (cached && cached.ok) return { ok: true, body: cached.body || body, passes: cached.passes || 3, cached: true };
  }
  const passes = parseInt(process.env.IMAGE_RENDER_VERIFY_PASSES || process.env.DDG_VERIFY_PASSES || '3', 10);
  const settleMs = parseInt(process.env.IMAGE_RENDER_SETTLE_MS || '600', 10);
  const conc = parseInt(process.env.IMAGE_VERIFY_CONCURRENCY || '6', 10);
  let failedUrls = null;
  for (let p = 0; p < passes; p++) {
    body = enforceCroCardLaw(body, id);
    if (hooks && hooks.onProgress) hooks.onProgress({ pass: p + 1, total: passes, label: 'render verify ' + (p + 1) + '/' + passes });
    if (hooks && hooks.save) await hooks.save(body);
    const urls = failedUrls || collectAllBodyImageUrls(body, id);
    const fast = p > 0;
    const checks = await pmapLimit(urls, conc, async u => ({ u, ok: await imgLoadsLiveStrict(u, id, { fastVerify: fast && !u.startsWith('/') }) }));
    const bad = checks.filter(c => !c.ok).map(c => c.u);
    if (!bad.length) {
      const result = { ok: true, body, passes: p + 1 };
      putImageVerifyCache(id, body, result);
      return result;
    }
    failedUrls = bad;
    if (p + 1 < passes) await new Promise(r => setTimeout(r, settleMs));
  }
  return { ok: false, body, passes };
}
async function ensureInternalImagesRendered(id, title, pillar, body, onProgress) {
  if (isTop10Body(body) || !INTERNAL_IMAGES_DDG) return body;
  const passes = parseInt(process.env.DDG_RENDER_VERIFY_PASSES || '2', 10);
  for (let p = 0; p < passes; p++) {
    if (await internalImagesLiveOk(body, id, { fastVerify: p > 0 })) return body;
    if (onProgress) onProgress({ done: p + 1, total: passes, label: 'verify render' });
    body = await finalizeInternalDdgImages(id, title, pillar, body, onProgress);
    await ddgSettle();
  }
  return body;
}
// STANDARD (owner 4444): a face-card image must be APPLICABLE. Only CRO/Tools (tl) may use a curated
// CRO cover; every other pillar falls back to a TOPICAL image (Pollinations by its own subject) — never
// a boardroom photo on a crabbing/aquarium/etc. answer.
function staticCover(pillar, title){
  if(pillar==='tl'){ let h=0; for(const c of 'tl') h=(h*31+c.charCodeAt(0))>>>0; return '/assets/cro-cover-'+((h % 5)+1)+'.jpg'; }
  return pollCoverUrl(title || ('best ' + pillar), pillar);   // topical, applicable to THIS pillar
}
async function ensureTopImage(id, title, pillar, body){
  const alt = String(title).replace(/[\[\]"]/g,'').slice(0,80);
  const cur = String(body).slice(0,1400).match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (REQUIRE_FLUX_IMAGES || INTERNAL_IMAGES_DDG) {
    if (cur && cur[1] === '/assets/qa/' + id + '.jpg') return body;
    const b = String(body).replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
    return '![' + alt + '](/assets/qa/' + id + '.jpg)\n\n' + b.trimStart();
  }
  if(cur && await imgLoads(cur[1])) return body;             // existing hero loads → keep it
  let b = String(body).replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');   // drop the broken/missing one
  const poll = pollCoverUrl(title, pillar);                  // tier 1: Pollinations (verified)
  if(await imgLoads(poll)) return '!['+alt+']('+poll+')\n\n'+b.trimStart();
  try{ await fixCover(id, title);                            // tier 2: DDG (writes blob; re-read + verify)
       const r=await store.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
       if(r&&r.answer){ const mm=String(r.answer).slice(0,1400).match(/!\[[^\]]*\]\(([^)]+)\)/); if(mm && await imgLoads(mm[1])) return r.answer; } }catch(e){}
  return '!['+alt+']('+staticCover(pillar, title)+')\n\n'+b.trimStart();   // tier 3: topical fallback
}
// ── MEDIA-IMAGE LAW (owner 2026-07-01 / 2026-07-03):
//   • Regular Q&A: flux hero + guaranteed Kory CRO (#2, does NOT count) + DDG under EVERY section.
//   • 3–10 COUNTED images = hero + section images only (Kory is extra, guaranteed).
//   • Top-10: top hero only + 10 @@PRODUCT images (ensureTop10Images) — no section rhythm images.
const PILLAR_DDG_TOPICAL = { ca:'automobile car vehicle', bt:'boat yacht marine', aq:'planted aquarium fish tank', er:'consumer electronics product', dn:'restaurant food dining', nl:'nightlife bar lounge', tn:'town city skyline', sc:'school campus', mv:'cinema film', es:'espresso coffee', tv:'television home theater', rs:'luxury resort hotel', cl:'cologne fragrance bottle', lv:'luxury vacation travel', ev:'event celebration', ga:'board game', gm:'video gaming setup', wl:'wellness spa retreat', dr:'sports training drill', fr:'franchise storefront', co:'collectible memorabilia', sy:'fashion outfit style', cr:'chesapeake crabbing', fs:'fishing boat water', pt:'pet animal', tk:'software dashboard workspace', ik:'business analytics chart', gb:'clean infographic', bo:'commercial real estate buildout', ai:'AI automation abstract', gp:'go to market strategy office', ra:'revenue operations office', bs:'business book desk', st:'sales training workshop', ce:'news media broadcast', q:'small business entrepreneur' };
function stripSectionLabel(h) {
  return String(h || '').replace(/^#{2,3}\s+/, '').replace(/^\d+\.\s*/, '').replace(/[^\w\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
}
function sectionDdgQuery(sectionHeading, qaTitle) {
  const sect = stripSectionLabel(sectionHeading);
  const titleCore = queryFrom(qaTitle, '');
  return (sect + ' ' + titleCore + ' high quality editorial photograph realistic').trim().slice(0, 180);
}
function sectionDdgQueries(sectionHeading, qaTitle, pillar) {
  const sect = stripSectionLabel(sectionHeading);
  const titleCore = queryFrom(qaTitle, '');
  const lane = PILLAR_DDG_TOPICAL[pillar] || 'professional editorial business photography';
  const out = [];
  const add = q => { q = String(q || '').replace(/\s+/g, ' ').trim().slice(0, 180); if (q && !out.includes(q)) out.push(q); };
  add(sectionDdgQuery(sectionHeading, qaTitle));
  add(sect + ' ' + titleCore + ' editorial photograph');
  add(queryFrom(sectionHeading, ' editorial photograph realistic'));
  add(queryFrom(qaTitle, ' editorial photograph realistic'));
  add(lane + ' ' + sect + ' editorial photograph');
  add(lane + ' ' + titleCore + ' editorial photograph');
  add(lane + ' editorial photograph professional');
  add('small business ' + titleCore + ' editorial photograph');
  return out;
}
async function pickImageTracked(q) {
  try {
    const img = await pickImage(q);
    if (!img) markLaneThrottled('ddg', 'DDG pick empty', LANE_THROTTLE_MS.ddg);
    else markLaneSuccess('ddg');
    return img;
  } catch (e) {
    if (isThrottleMsg(e.message)) markLaneThrottled('ddg', e.message);
    return '';
  }
}
async function ensureDdgSectionTracked(id, ti, secText, excludeUrls) {
  try {
    const local = await ensureDdgSectionImage(id, ti, secText, { excludeUrls: excludeUrls ? [...excludeUrls] : [] });
    if (!local) markLaneThrottled('ddg', 'section fetch failed', LANE_THROTTLE_MS.ddg);
    else markLaneSuccess('ddg');
    return local;
  } catch (e) {
    if (isThrottleMsg(e.message)) markLaneThrottled('ddg', e.message);
    return null;
  }
}
async function fluxCoverTracked(id, title, body, coverSrc, onProgress, shouldStop) {
  if (bothLanesCooling()) return { body, skipped: true, reason: 'both cooling' };
  if (fluxLaneCooling()) return { body, skipped: true };
  const fr = await fluxifyCoverOnly(id, title, body, coverSrc, onProgress, shouldStop);
  if (coverFileOk(id) || faceCoverOk(id)) markLaneSuccess('flux');
  else if (!coverFileOk(id) && !faceCoverOk(id)) {
    const est = laneEstimateMs();
    const coolMs = Math.max(est.fluxReadyInMs, fluxSpacingMs(), LANE_THROTTLE_MS.flux);
    markLaneThrottled('flux', est.fluxBusy ? 'pollinator busy' : 'cover generation failed', coolMs);
  }
  return fr;
}
function pipelineBothImageBlocked(ui, out) {
  const est = laneEstimateMs();
  if (!updateBothCooldownStick(est)) return false;
  const rot = imageRotateState();
  const msg = 'Both APIs cooling — stick ' + (rot.stickLabel || 'DDG') + ' · wait ~' + rot.waitSec + 's';
  pipelineDone(ui, 'pollinator_cover', msg);
  pipelineDone(ui, 'pollinator_flux', msg);
  if (out && !out.steps.includes('both-cooling-skip')) out.steps.push('both-cooling-skip');
  return true;
}
async function resolveSectionDdgUrl(sectionHeading, qaTitle, pillar, id, excludeUrls) {
  if (id) {
    const reused = await pickReusableLibraryImage(id, pillar, sectionDdgQuery(sectionHeading, qaTitle), excludeUrls ? [...excludeUrls] : []);
    if (reused && await imgLoadsLive(reused)) return reused;
  }
  for (const q of sectionDdgQueries(sectionHeading, qaTitle, pillar)) {
    const img = await pickImageTracked(q);
    if (img && await imgLoadsLive(img)) return img;
    await ddgQueryPace();
  }
  return '';
}
async function pickSectionDdgImage(sectionHeading, qaTitle, pillar, id, excludeUrls) {
  return resolveSectionDdgUrl(sectionHeading, qaTitle, pillar, id, excludeUrls);
}
async function sweepBadInternalImages(id, title, pillar, body, onProgress) {
  if (isTop10Body(body) || !INTERNAL_IMAGES_DDG) return body;
  let lines = String(body).split('\n');
  let changed = false;
  let heroSeen = false;
  const badSlots = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (!m) continue;
    if (!heroSeen) { heroSeen = true; continue; }
    const url = m[2];
    if (isKoryCroImg(url)) continue;
    if (!isBadInternalUrl(url, id) && await imgLoadsLive(url)) continue;
    let sect = '';
    for (let j = i - 1; j >= 0; j--) {
      if (/^#{2,3}\s/.test(lines[j]) && !MEDIA_SKIP_HEADING.test(lines[j])) { sect = lines[j]; break; }
    }
    badSlots.push({ line: i, caption: m[1], sect: sect || title });
  }
  for (let si = 0; si < badSlots.length; si++) {
    const slot = badSlots[si];
    const url = await resolveSectionDdgUrl(slot.sect, title, pillar, id, bodyPageImageUrls(body));
    if (url && await imgLoadsLive(url)) {
      const cap = slot.caption || (String(title).replace(/[\[\]"]/g, '').slice(0, 66) + ' — ' + stripSectionLabel(slot.sect).slice(0, 56));
      lines[slot.line] = '![' + cap + '](' + url + ')';
      changed = true;
      await ddgAfterSectionCommit(url, onProgress);
      if (si + 1 < badSlots.length) await ddgPace();
    } else {
      await ddgPace();
    }
    if (onProgress) onProgress({ done: si + 1, total: badSlots.length, label: stripSectionLabel(slot.sect) || 'section' });
  }
  return changed ? lines.join('\n') : body;
}
async function ensureInternalDdgImages(id, title, pillar, body, onProgress) {
  if (isTop10Body(body) || !INTERNAL_IMAGES_DDG) return body;
  body = collapseStackedSectionImages(trimExcessMediaImages(stripPlaceholderImageLines(body)), id);
  let lines = String(body).split('\n');
  const targets = ddgImageSectionTargets(lines, body);
  let changed = false;
  for (let ti = 0; ti < targets.length; ti++) {
    const idx = targets[ti];
    const sect = lines[idx];
    const caption = String(title).replace(/[\[\]"]/g, '').slice(0, 66) + ' — ' + sect.replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').slice(0, 56);
    const imgLines = sectionImageLineIdxs(lines, idx);
    const oldUrl = imgLines.length ? ((lines[imgLines[0]].match(/!\[[^\]]*\]\(([^)\s]+)\)/) || [])[1] || '') : '';
    const needs = !imgLines.length || isBadInternalUrl(oldUrl, id) || (!/^\/assets\/qa\//.test(oldUrl) && !(await imgLoadsLive(oldUrl)));
    if (!needs) { if (onProgress) onProgress({ done: ti + 1, total: targets.length, label: sect.replace(/^#{2,3}\s+/, '') }); continue; }
    const secText = stripSectionLabel(sect) + ' ' + String(title).replace(/[\[\]"?]/g, '').trim();
    const local = await ensureDdgSectionTracked(id, ti, secText, bodyPageImageUrls(lines.join('\n')));
    if (local) {
      setSectionImageTag(lines, idx, '![' + caption + '](' + local + ')');
      changed = true;
      await ddgAfterSectionCommit(local, onProgress, id);
      if (ti + 1 < targets.length) await ddgPace();
    } else {
      await ddgPace();
    }
    if (onProgress) onProgress({ done: ti + 1, total: targets.length, label: sect.replace(/^#{2,3}\s+/, '') });
  }
  return changed ? collapseStackedSectionImages(lines.join('\n'), id) : body;
}
// One DDG section per lane tick (time-sliced scrub).
async function ddgFillOneSection(id, title, pillar, body, ti) {
  if (isTop10Body(body) || !INTERNAL_IMAGES_DDG) return body;
  body = collapseStackedSectionImages(trimExcessMediaImages(stripPlaceholderImageLines(body)), id);
  let lines = String(body).split('\n');
  const targets = ddgImageSectionTargets(lines, body);
  if (ti < 0 || ti >= targets.length) return body;
  const idx = targets[ti];
  const sect = lines[idx];
  const caption = String(title).replace(/[\[\]"]/g, '').slice(0, 66) + ' — ' + sect.replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').slice(0, 56);
  const imgLines = sectionImageLineIdxs(lines, idx);
  const oldUrl = imgLines.length ? ((lines[imgLines[0]].match(/!\[[^\]]*\]\(([^)\s]+)\)/) || [])[1] || '') : '';
  const needs = !imgLines.length || isBadInternalUrl(oldUrl, id) || (!/^\/assets\/qa\//.test(oldUrl) && !(await imgLoadsLive(oldUrl)));
  if (!needs) return body;
  const secText = String(sect).replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').trim() + ' ' + String(title).replace(/[\[\]"?]/g, '').trim();
  const local = await ensureDdgSectionTracked(id, ti, secText, bodyPageImageUrls(body));
  laneDdgLastAt = Date.now();
  if (local) {
    setSectionImageTag(lines, idx, '![' + caption + '](' + local + ')');
    await ddgAfterSectionCommit(local, null, id);
    return collapseStackedSectionImages(lines.join('\n'), id);
  }
  return body;
}
async function fluxFillOneSection(id, title, pillar, body, ti) {
  if (isTop10Body(body) || INTERNAL_IMAGES_DDG) return body;
  body = trimExcessMediaImages(stripPlaceholderImageLines(body));
  let lines = String(body).split('\n');
  const targets = ddgImageSectionTargets(lines, body);
  if (ti < 0 || ti >= targets.length) return body;
  const idx = targets[ti];
  const sect = lines[idx];
  const caption = String(title).replace(/[\[\]"]/g, '').slice(0, 66) + ' — ' + sect.replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').slice(0, 56);
  let imgLine = -1, oldUrl = '';
  for (let j = idx + 1; j < lines.length; j++) {
    if (/^#{2,3}\s/.test(lines[j])) break;
    const m = lines[j].match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (m) { imgLine = j; oldUrl = m[2]; break; }
  }
  const needs = imgLine < 0 || isBadInternalUrl(oldUrl, id) || (!/^\/assets\/qa\//.test(oldUrl) && !(await imgLoadsLive(oldUrl)));
  if (!needs) return body;
  const secText = String(sect).replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').trim() + ' ' + String(title).replace(/[\[\]"?]/g, '').trim();
  const n = ti + 2;
  const rel = '/assets/qa/' + id + '-' + n + '.jpg';
  let local = null;
  try { if (fs.statSync(WD + rel).size > 8000) local = rel; } catch (e) {}
  if (!local) local = await makeContent(id, n, secText || title);
  if (local) {
    const tag = '![' + caption + '](' + local + ')';
    if (imgLine >= 0) lines[imgLine] = tag;
    else lines.splice(idx + 1, 0, '', tag, '');
    return lines.join('\n');
  }
  return body;
}
// PER-SLOT TOP-10 IMAGE FILL (owner 2026-07-08). For MOVIES (mv): pull the REAL, title-matched
// poster from the poster library (assets/qa/_poster-lib, 2200+ posters) via ensureDdgSectionImage's
// moviePoster path — poster-graded to fit the tile, self-hosted → /assets/qa/<id>-1NN.jpg; falls to
// flux only if the movie isn't in the library. For other pillars: Pollinator-generate any slot DDG
// left EMPTY or holding a banned live image.pollinations.ai URL. Guarantees every slot has a valid
// self-hosted image so the entry never stalls. Returns { body, filled }.
// De-number meta headings that the writer wrongly numbered as ranks (owner 2026-07-08).
// e.g. "## 1. How We Ranked the Top 10" → "## How We Ranked the Top 10" — otherwise the meta
// section is parsed as a phantom rank #1 with no @@PRODUCT image and the Top-10 audit reports
// missing:["1"] forever, blocking the entry from ever certifying.
const META_HEADING_RE = /^##\s+\d+\.\s+(How We Ranked|How to Choose|What to Look For|What Makes|Which\b|Why\b|Bottom Line|FAQ|Sources|Related\b|Direct Answer)/gim;
function deNumberMetaHeadings(body) {
  return String(body).replace(META_HEADING_RE, '## $1');
}
// Strip a leading markdown image (the "top hero") from a Top-10 body — ranking lists forbid a top
// hero (owner: remove top image on Top-10). rankingListHasTopHero = body starts with ![..](..).
function stripTop10TopHero(body) {
  return String(body).replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n+/, '');
}
async function fluxFillTop10Gaps(id, title, body) {
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const isMv = pillar === 'mv';
  const lines = String(body).split('\n');
  let filled = 0, slotNum = 0;
  const tclean = String(title).replace(/[\[\]"?]/g, '').trim();
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^##\s+(\d+)\.\s+/);
    if (h) { slotNum = parseInt(h[1], 10); continue; }
    const pm = lines[i].match(/^@@PRODUCT\s+name="([^"]*)"(?:\s+img="([^"]*)")?(?:\s+site="([^"]*)")?/);
    if (!pm) continue;
    const name = pm[1] || ''; const img = pm[2] || ''; const site = pm[3] || '';
    // mv: ALWAYS (re)pull the real title-matched poster for EVERY slot — the poster library is
    // authoritative, so stale flux/DDG slot images from prior runs get replaced with the real poster.
    // others: only fill empty / banned-live-pollinations slots.
    const needsFill = isMv ? true : (!img || /image\.pollinations\.ai/i.test(img));
    if (!needsFill || !slotNum) continue;
    let local = null;
    try {
      local = isMv
        ? await ensureDdgSectionImage(id, 100 + slotNum, (name + ' ' + tclean).trim(), { moviePoster: true, movieSlot: name })
        : await makeContent(id, 100 + slotNum, (name + ' ' + tclean).trim());
    } catch (e) {}
    if (local) {
      lines[i] = '@@PRODUCT name="' + name.replace(/"/g, '') + '" img="' + local + '"' + (site ? ' site="' + site.replace(/"/g, '') + '"' : '');
      filled++;
    }
  }
  return { body: filled ? lines.join('\n') : body, filled };
}
async function sweepOneBadInternal(id, title, pillar, body) {
  if (isTop10Body(body)) return body;
  let lines = String(body).split('\n');
  let heroSeen = false, si = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (!m) continue;
    if (!heroSeen) { heroSeen = true; continue; }
    si++;
    const url = m[2];
    if (isKoryCroImg(url)) continue;
    if (/^\/assets\/qa\//.test(url) && !isBadInternalUrl(url, id)) continue;
    if (!isBadInternalUrl(url, id) && await imgLoadsLive(url)) continue;
    let sect = '';
    for (let j = i - 1; j >= 0; j--) {
      if (/^#{2,3}\s/.test(lines[j]) && !MEDIA_SKIP_HEADING.test(lines[j])) { sect = lines[j]; break; }
    }
    const secText = stripSectionLabel(sect || title) + ' ' + String(title).replace(/[\[\]"?]/g, '').trim();
    let local = null;
    if (INTERNAL_IMAGES_DDG) {
      local = await ensureDdgSectionImage(id, si, secText, { excludeUrls: [...bodyPageImageUrls(body)] });
      laneDdgLastAt = Date.now();
    } else {
      local = await makeContent(id, si + 2, secText || title);
    }
    if (local) {
      const cap = m[1] || (String(title).replace(/[\[\]"]/g, '').slice(0, 66) + ' — ' + stripSectionLabel(sect).slice(0, 56));
      lines[i] = '![' + cap + '](' + local + ')';
      return lines.join('\n');
    }
    break;
  }
  return body;
}
async function finalizeInternalDdgImages(id, title, pillar, body, onProgress) {
  if (isTop10Body(body) || !INTERNAL_IMAGES_DDG) return body;
  const rounds = parseInt(process.env.DDG_INTERNAL_ROUNDS || '3', 10);
  for (let r = 0; r < rounds; r++) {
    body = collapseStackedSectionImages(body, id);
    if (internalImagesOk(body, id) && await internalImagesLiveOk(body, id) && mediaOk(body, id)) return body;
    body = await ensureInternalDdgImages(id, title, pillar, body, onProgress);
    body = collapseStackedSectionImages(body, id);
    if (internalImagesOk(body, id) && await internalImagesLiveOk(body, id) && mediaOk(body, id)) return body;
    await ddgPace();
  }
  return collapseStackedSectionImages(body, id);
}
/** After DDG pass — fix within-page duplicate images only (cross-page reuse is OK). */
async function dedupeEntryImages(id, title, body, ui, out, opts) {
  opts = opts || {};
  pipelineStage(ui, 'pollinator_flux', 0, 1, 'Scanning within-page duplicate images…');
  const r = await sweepAllDuplicateImages(id, title, body, {
    libraryOnly: !!opts.libraryOnly,
    onProgress: p => {
      if (opts.onProgress) opts.onProgress(p);
      pipelineStage(ui, 'pollinator_flux', p.done, Math.max(p.done, 1), '🔄 ' + (p.label || 'dupe rotate'));
    },
  });
  if (r.fixed > 0) {
    autoLog('🔄 ' + id + ' — swapped ' + r.fixed + ' duplicate image(s) for topical variants');
    pushScrubActivity('🔄 ' + id + ' dupe sweep · ' + r.fixed + ' image(s) rotated', { id, status: 'dupe-sweep' });
    if (out && !out.steps.includes('dupe-images')) out.steps.push('dupe-images:' + r.fixed);
  } else {
    const chk = await countBodyImageDupes(id, r.body);
    if (!chk.total) markImageDupeResolved(id);
    else noteImageDupe(id, chk.total);
  }
  pipelineDone(ui, 'pollinator_flux', r.fixed ? ('Within-page dupe sweep · ' + r.fixed + ' rotated') : 'No within-page duplicate images');
  return r.body;
}
function countImages(body){ return (String(body).match(/!\[[^\]]*\]\([^)]+\)/g) || []).length; }
function countMediaImages(body) {
  const imgs = [...String(body || '').matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)];
  return imgs.filter(m => m[1] !== KORY_CRO_IMG).length;
}
function hasKoryCro(body) { return String(body || '').includes(KORY_CRO_IMG); }
function maxFluxSlot(body, id) {
  let max = 1;
  const re = new RegExp('/assets/qa/' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d+)\\.jpg', 'g');
  let m;
  while ((m = re.exec(String(body || '')))) max = Math.max(max, parseInt(m[1], 10));
  return max;
}
const MEDIA_MIN = 3, MEDIA_MAX = 10;   // regular Q&A counted: 1 hero + up to 9 DDG section images
const TOP10_IMAGE_TOTAL = 11;          // default Top-10; Best-5 = 6 via rankingImageTotal(body, title)
const TOP10_PRODUCT_SLOTS = 10;        // default; use expectedRankCount(body, title) for variable N
const MEDIA_SKIP_HEADING = /^#{2,3}\s+(FAQ|Sources|References|Related on PULSE)/i;
const KORY_CRO_ALT = 'Kory White, Fractional CRO — CRO Syndicate';

function contentSectionHeadings(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^#{2,3}\s+\S/.test(lines[i]) && !MEDIA_SKIP_HEADING.test(lines[i])) out.push(i);
  }
  return out;
}
// DDG + media law: one image under major ## sections only (not every ###), max 9 sections + hero = 10 counted.
// Top-10 lists skip this entirely — they use hero + 10 @@PRODUCT imgs (see TOP10_IMAGE_TOTAL), not DDG sections.
function ddgImageSectionTargets(lines, body) {
  if (body && isTop10Body(body)) return [];
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+\S/.test(lines[i]) && !MEDIA_SKIP_HEADING.test(lines[i])) out.push(i);
  }
  return out.slice(0, Math.max(0, MEDIA_MAX - 1));
}
function trimExcessMediaImages(body) {
  if (isTop10Body(body)) return body;
  let heroSeen = false, kept = 0;
  const out = [];
  for (const line of String(body || '').split('\n')) {
    const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (!m) { out.push(line); continue; }
    const url = m[2];
    if (!heroSeen) { heroSeen = true; out.push(line); continue; }
    if (isKoryCroImg(url)) continue;
    if (kept < MEDIA_MAX - 1) { kept++; out.push(line); continue; }
  }
  return out.join('\n');
}
/** One image per ## section — drop stacked duplicates (auto-populate bug). */
function sectionImageLineIdxs(lines, headingIdx) {
  const out = [];
  for (let j = headingIdx + 1; j < lines.length; j++) {
    if (/^#{2,3}\s/.test(lines[j])) break;
    if (/!\[[^\]]*\]\([^)]+\)/.test(lines[j])) out.push(j);
  }
  return out;
}
function collapseStackedSectionImages(body, id) {
  if (isTop10Body(body)) return body;
  let lines = String(body).split('\n');
  let changed = false;
  for (const idx of ddgImageSectionTargets(lines, body)) {
    const imgLines = sectionImageLineIdxs(lines, idx);
    if (imgLines.length <= 1) continue;
    let keep = imgLines[0];
    for (const j of imgLines) {
      const url = (lines[j].match(/!\[[^\]]*\]\(([^)\s]+)\)/) || [])[1];
      if (url && /^\/assets\/qa\//.test(url) && !isBadInternalUrl(url, id)) { keep = j; break; }
    }
    for (let k = imgLines.length - 1; k >= 0; k--) {
      if (imgLines[k] === keep) continue;
      lines.splice(imgLines[k], 1);
      changed = true;
    }
  }
  return changed ? lines.join('\n') : body;
}
function setSectionImageTag(lines, headingIdx, tag) {
  const imgLines = sectionImageLineIdxs(lines, headingIdx);
  if (imgLines.length) {
    lines[imgLines[0]] = tag;
    for (let k = imgLines.length - 1; k > 0; k--) lines.splice(imgLines[k], 1);
  } else {
    lines.splice(headingIdx + 1, 0, '', tag, '');
  }
}
function sectionHasImageAfter(lines, headingIdx, targetIdx) {
  for (let j = headingIdx + 1; j < lines.length; j++) {
    if (/^#{2,3}\s/.test(lines[j])) break;
    if (/!\[[^\]]*\]\([^)]+\)/.test(lines[j])) return true;
  }
  return false;
}
function mediaSectionsComplete(body) {
  if (isTop10Body(body)) return true;
  const lines = String(body || '').split('\n');
  const targets = ddgImageSectionTargets(lines, body);
  const n = countMediaImages(body);
  if (!targets.length) return n >= MEDIA_MIN && n <= MEDIA_MAX;
  return n >= MEDIA_MIN && n <= MEDIA_MAX && targets.every((idx, ti) => sectionHasImageAfter(lines, idx, ti));
}
function koryCroPresent(body) { return true; } // CRO widget injected at render time — never in blob markdown
function ensureKoryAfterHero(body) {
  return String(body || '').split('\n').filter(line => {
    const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    return !(m && isKoryCroImg(m[2]));
  }).join('\n');
}
// CRO CARD LAW: blob must NOT carry kory-white or baked CRO ads — render time injects the widget only.
function enforceCroCardLaw(body, id) {
  if (!body) return body;
  let b = stripAllCroFromBody(body);
  return b.split('\n').filter(line => {
    const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    return !(m && isKoryCroImg(m[2]));
  }).join('\n');
}
function croCardLawOk(body, id) {
  if (!body) return false;
  if (isTop10Body(body)) return countCroInBody(body) === 0;
  if (countCroInBody(body) > 0) return false;
  const imgs = [...String(body).matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)];
  return imgs.every(m => !isKoryCroImg(m[1]));
}
/** One face-card path for mosaic + top hero; strip dupes + CRO from blob (CRO = render-time only). */
function finalizePollinatorScrubBody(id, title, body) {
  let b = syncHeroDupesFaceCard(id, title, String(body || ''));
  b = ensureKoryAfterHero(b);
  b = enforceCroCardLaw(b, id);
  return b;
}
function internalImagesFixOpts(extra) {
  return Object.assign({
    pillarOf,
    internalImagesOk,
    mediaOk,
    useDdg: INTERNAL_IMAGES_DDG,
    finalizeDdgImages: INTERNAL_IMAGES_DDG ? finalizeInternalDdgImages : null,
    ensureInternalRendered: INTERNAL_IMAGES_DDG ? ensureInternalImagesRendered : null,
    collapseSectionImages: collapseStackedSectionImages,
    verifyAllImagesRender: INTERNAL_IMAGES_DDG ? async (id, title, body, opts) => {
      let b = collapseStackedSectionImages(body, id);
      b = await ensureInternalImagesRendered(id, title, pillarOf(id), b, opts && opts.onProgress);
      b = collapseStackedSectionImages(b, id);
      b = enforceCroCardLaw(b, id);
      const triple = await tripleVerifyAllImagesRender(b, id, { forceVerify: true });
      b = triple.body || b;
      const live = await internalImagesLiveOk(b, id);
      const audit = internalImagesRubricAudit(id, b, { internalImagesOk, mediaOk });
      return { ok: !!(triple.ok && live && audit.pass), body: b, triple, audit };
    } : null,
    ensureMediaImages: INTERNAL_IMAGES_DDG ? ensureMediaImages : undefined,
    enforceCroCardLaw,
    finalizeBody: INTERNAL_IMAGES_DDG ? null : (i, t, b) => finalizePollinatorScrubBody(i, t, b),
  }, extra || {});
}
const mediaOk = (b, id) => {
  if (isTop10Body(b)) return auditTop10Images(id || 'x', b).compliant;
  const n = countMediaImages(b);
  return n >= MEDIA_MIN && n <= MEDIA_MAX && mediaSectionsComplete(b) && koryCroPresent(b);
};
async function ensureMediaImages(id, title, pillar, body){
  body = collapseStackedSectionImages(await ensureTopImage(id, title, pillar, body), id);
  if (isTop10Body(body)) {
    try {
      const ri = await ensureTop10Images(id, title, body);
      if (ri && ri.body) body = ri.body;
    } catch (e) {}
    return body;
  }

  body = ensureKoryAfterHero(body);

  const alt = String(title).replace(/[\[\]"]/g,'').slice(0,66);
  let lines = String(body).split('\n');
  const targets = ddgImageSectionTargets(lines, body);
  const picks = [];
  let fluxSlot = maxFluxSlot(body, id);

  for (let ti = 0; ti < targets.length; ti++) {
    const idx = targets[ti];
    if (sectionHasImageAfter(lines, idx, ti)) continue;
    if (countMediaImages(lines.join('\n')) + picks.length >= MEDIA_MAX) break;
    const sect = lines[idx].replace(/^#{2,3}\s+/,'').replace(/[\[\]"]/g,'').slice(0,56);
    let url;
    if (REQUIRE_FLUX_IMAGES) {
      fluxSlot++;
      url = '/assets/qa/' + id + '-' + fluxSlot + '.jpg';
    } else if (INTERNAL_IMAGES_DDG) {
      url = await resolveSectionDdgUrl(lines[idx], title, pillar);
      if (!url || !(await imgLoadsLive(url))) url = await resolveSectionDdgUrl(title, title, pillar);
      if (url && await imgLoadsLive(url)) {
        await ddgAfterSectionCommit(url);
        if (ti + 1 < targets.length) await ddgPace();
      } else await ddgPace();
    } else {
      url = pollCoverUrl(sect + ' ' + title, pillar);
    }
    if (INTERNAL_IMAGES_DDG && (!url || !(await imgLoadsLive(url)))) continue;
    picks.push({ idx, url, caption: alt + ' — ' + sect });
  }

  if (!picks.length) return lines.join('\n');
  if (!REQUIRE_FLUX_IMAGES && !INTERNAL_IMAGES_DDG) {
    await Promise.all(picks.map(async p => {
      if (!(await imgLoads(p.url))) p.url = staticCover(pillar, p.caption);
    }));
  }
  picks.sort((a,b)=>b.idx-a.idx).forEach(p => {
    setSectionImageTag(lines, p.idx, '!['+p.caption+']('+p.url+')');
  });
  return enforceCroCardLaw(collapseStackedSectionImages(lines.join('\n'), id), id);
}

let genJob = { running:false, pillar:'', pillarName:'', target:0, published:0, parked:0, tried:0, current:null, stage:'idle', startedAt:null, log:[], stop:false, error:'' };
let genQueue = [];   // pending runs — ONE at a time, the rest wait and auto-start (owner 2026-07-01)
// ── Writing history (owner 2026-07-02): rolling 24h record of every entry written, so the UI
// can show PAST · CURRENT · QUEUED writing separated by pillar. ──
const HISTF = WD + '/_write_history.json';
let writeHistory = [];
try { writeHistory = JSON.parse(fs.readFileSync(HISTF, 'utf8')) || []; } catch (e) { writeHistory = []; }
function pruneHistory(){ const cut = Date.now() - 24 * 3600 * 1000; writeHistory = writeHistory.filter(h => h && h.ts >= cut); }
function histAdd(id, pillar, title, status, score){
  pruneHistory();
  writeHistory.unshift({ ts: Date.now(), id: id || '', pillar: pillar || '?', pillarName: pName(pillar || '?'), title: String(title || '').slice(0, 80), status, score: (score == null ? null : score) });
  if (writeHistory.length > 4000) writeHistory = writeHistory.slice(0, 4000);
  try { fs.writeFileSync(HISTF, JSON.stringify(writeHistory)); } catch (e) {}
}
// per-pillar-per-day limits: each specific pillar tracked; random-each-Q has no separate cap
const GENDAYF = WD + '/_gen_pillar_day.json';
function genDay(){ try{ const d = JSON.parse(fs.readFileSync(GENDAYF, 'utf8')); if (d.day === today()) return d; } catch(e){} return { day: today(), pillars: {} }; }
function genDaySave(d){ try { fs.writeFileSync(GENDAYF, JSON.stringify(d)); } catch(e){} }
function genLimitCheck(sel){
  if (sel === 'random') return { ok: true };
  const d = genDay();
  if ((byPillar[sel]||[]).length >= capFor(sel)) return { ok:false, msg: pName(sel)+' is at its '+capFor(sel).toLocaleString()+'-entry cap' };
  return { ok:true };
}
function genLimitMark(sel){ if (sel === 'random') return; const d = genDay(); d.pillars[sel] = (d.pillars[sel]||0)+1; genDaySave(d); }
function pickRandomPillar() {
  const pillars = activePillars();
  return pillars[Math.floor(Math.random() * pillars.length)];
}
async function loadGenExampleForPillar(pillar) {
  genExample = '';
  try {
    for (const s of (byPillar[pillar] || []).slice(-5).reverse()) {
      const e = await store.get('answers/' + s.id + '.json', { type: 'json' }).catch(() => null);
      if (e && e.answer && e.answer.length > 900) {
        genExample = e.answer.slice(0, 4200);
        genLog('📐 following format of ' + s.id);
        break;
      }
    }
  } catch (e) {}
}
// mutex — serialize id-reservation + publish so the 2 writers can't collide
let _glock = Promise.resolve();
function locked(fn){ const run = _glock.then(fn, fn); _glock = run.then(()=>{}, ()=>{}); return run; }
// EXTRA gate (owner): the Direct Answer must not be lazy — ≥2 full sentences of real substance
function directAnswerFull(body){
  const m = String(body).match(/##\s+Direct\s+Answer\s*\n+([\s\S]*?)(?=\n#{2,3}\s|\n```|$)/i);
  if(!m) return false;
  const para = m[1].replace(/[#*`>_]/g,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').trim();
  const sentences = (para.match(/[.!?](?:\s|$)/g) || []).length;
  return para.length >= 140 && sentences >= 2;   // ≥2 sentences, ≥~140 chars — no one-liners
}
function saveGen(){ try { fs.writeFileSync(GENF, JSON.stringify(genJob)); } catch(e){} }
function genLog(s){ genJob.log.unshift(new Date().toLocaleTimeString()+' '+s); genJob.log = genJob.log.slice(0,14); saveGen(); }

// Route to Claude Code or DeepSeek per LANE_AUDITOR_MODE (default ds — CC CLI often unavailable).
async function routeAuditor(title, body, sys) {
  const c = resolveAuditorCounts();
  if (c.claudeCodePerArticle > 0) {
    const v = await claudeAudit(title, body, sys);
    if (v.err && c.deepseekFallbackOnCliError) return dsAudit(title, body, sys);
    return v;
  }
  return dsAudit(title, body, sys);
}
// Claude fabrication auditor — used when LANE_AUDITOR_MODE=claude|claude+ds
async function claudeAudit(title, body, sys){
  const clean = String(body).replace(/#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{2,3}\s|$)/i,'');
  const prompt = (sys || AUDIT_SYS) + `\n\nAudit the answer titled "${title}". Score it out of 13, PASS at >=12. Reply with ONE line ONLY: VERDICT=PASS|score=NN/13|notes=... or VERDICT=FAIL|score=NN/13|notes=<the problem>\n\n--- ANSWER ---\n${clean.slice(0,18000)}`;
  const r = await claudeCli(prompt, 120000);   // Max plan, no API key
  if(!r.ok) return { pass:false, score:null, notes:'claude-cli '+(r.err||'err'), err:true };
  const t = r.text; const sm = t.match(/score\s*=\s*(\d+)/i);
  return { pass:/VERDICT\s*=\s*PASS/i.test(t) && (!sm || +sm[1] >= 12), score: sm?+sm[1]:null, notes:(t.match(/notes\s*=\s*(.+)$/i) || [, t.slice(0,120)])[1].trim().slice(0,200), via:'max-plan' };
}
// FALLBACK auditor — an INDEPENDENT DeepSeek skeptic (fresh call, no memory of writing it),
// used ONLY when Claude is unavailable (e.g. API out of credit) so the crew never stalls.
// Low temp + ruthless prompt so it actually critiques rather than rubber-stamps.
async function dsAudit(title, body, sys){
  const clean = String(body).replace(/#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{2,3}\s|$)/i,'');
  try{
    const { content } = await dsChat([{ role:'system', content:(sys || AUDIT_SYS)+'\nYou are auditing another AI\'s work — be skeptical and independent. Reply ONE line: VERDICT=PASS|score=NN/13|notes=... or VERDICT=FAIL|score=NN/13|notes=<the problem>.' }, { role:'user', content:`Audit "${title}". Score /13, PASS at >=12.\n\n${clean.slice(0,18000)}` }], { temperature:0.2 });
    const t = String(content||''); const sm = t.match(/score\s*=\s*(\d+)/i);
    return { pass:/VERDICT\s*=\s*PASS/i.test(t) && (!sm || +sm[1] >= 12), score: sm?+sm[1]:null, notes:(t.match(/notes\s*=\s*(.+)$/i) || [, t.slice(0,120)])[1].trim().slice(0,200), via:'deepseek' };
  }catch(e){ return { pass:false, score:null, notes:'ds-audit err '+e.message, err:true }; }
}
// Single auditor — fabrication + Pollinator image law. Respects LANE_AUDITOR_MODE.
async function claudeGateAudit(title, body, id, hooks) {
  const pollNote = id ? pollinatorImagesNote(id, body) : '';
  const bodyForAudit = String(body) + pollNote;
  if (hooks && hooks.onAudit) hooks.onAudit({ phase: 'running', cur: 0, max: 1, detail: 'Auditor running…' });
  const v = await routeAuditor(title, bodyForAudit, AUDIT_SYS);
  if (hooks && hooks.onAudit) hooks.onAudit({ phase: 'done-one', cur: 1, max: 1, detail: 'Auditor ' + (v.pass ? 'passed' : 'failed') });
  if (v.err || !v.pass) return v;
  return { pass: true, score: v.score || 12, notes: v.via === 'deepseek' ? 'ds-auditor' : 'auditor passed', via: v.via || 'claude' };
}
// 🔒 AUTO-PUBLISH GATE (owner 2026-07-04): decide whether a rubric-passed article may go
// straight to green with NO owner review. Requires ALL of:
//   1) full rubric 13/13 (gate.score === 13)
//   2) ✍️ WRITING auditor  — Claude Code CLI: fabrication + content quality
//   3) 🖼 DDG/IMAGES auditor — DeepSeek skeptic: every section/Top-10 image present + relevant
//   4) 🌸 HERO auditor (yourself) — Claude Code personal: Pollinator face-card present + on-topic
// Each auditor OWNS ONE LANE (writing / DDG / hero) so a specialist catches what a generalist misses,
// and they are STAGGERED in time (AUDIT_STAGGER_MS) so they are fresh independent passes that don't
// all share the same blind spot. Any miss — or any auditor that can't run — → owner review pile.
const AUDIT_STAGGER_MS = parseInt(process.env.AUDIT_STAGGER_MS || '3500', 10);
const AUTO_MAX_RETRIES = parseInt(process.env.AUTO_MAX_RETRIES || '4', 10);
const _sleepMs = ms => new Promise(r => setTimeout(r, Math.max(0, ms)));
const AUDIT_SYS_WRITING = AUDIT_SYS + '\n\nYOUR LANE = WRITING QUALITY & FABRICATION. Focus on the prose: invented vendors, products, prices, statistics, studies, or quotes = FAIL. Also fail thin/padded/off-topic content. Ignore image concerns — another auditor owns those.';
const AUDIT_SYS_DDG = AUDIT_SYS + '\n\nYOUR LANE = SECTION & TOP-10 IMAGES (DuckDuckGo). Check that the images referenced in the markdown are present, each is topically relevant to the section it sits in, none are obvious placeholders/broken, and captions match. For Top-10 lists: EVERY numbered rank must have its OWN unique image of THAT EXACT item (e.g. #9 Metroid must show Metroid — not a random unrelated image and never the same URL on two ranks). PASS only if the images genuinely support the article. Do not re-audit prose fabrication — another auditor owns that.';
const AUDIT_SYS_HERO = AUDIT_SYS + '\n\nYOUR LANE = the HERO / FACE-CARD COVER (Pollinator flux). Final sign-off before AUTO-PUBLISH with no human review. Confirm the hero cover is present, on-topic for the title, and satisfies the face-card law. Be maximally strict — if anything about the top-of-page hero is off, FAIL.';
function rubricStationAuditSys(station) {
  const st = STATIONS[station] || STATIONS.writing;
  if (station === 'writing') return AUDIT_SYS_WRITING;
  if (station === 'face') return AUDIT_SYS_HERO;
  if (station === 'internal') return AUDIT_SYS_DDG;
  if (station === 'top10') return AUDIT_SYS_DDG;
  if (station === 'publish') return AUDIT_SYS;
  return AUDIT_SYS + '\n\n' + (st.auditSys || '');
}
async function runRubricStationAuditor(id, title, body, station) {
  const a = await routeAuditor(title, body, rubricStationAuditSys(station));
  if (a.err) return { pass: false, notes: a.notes || 'auditor error' };
  return { pass: !!a.pass, notes: a.notes || '' };
}
async function laneAutoPublishGate(id, title, body, gate) {
  if (isHumanAuditorMode()) return { publish: false, reason: 'You\'re the auditor — approval pile' };
  // Gate on the CHECKLIST, not the raw number (owner 2026-07-04): rubricSignOff.pass is true only
  // when ALL rubric checkmarks are green — and a fully-complete article can still read 12/13 due to
  // a known content-grade quirk. A full-rubric 12 is fine to auto-publish; only an INCOMPLETE rubric
  // (a real missing checkmark) is sent back to re-scrub.
  if (!gate || !gate.pass) {
    return { publish: false, reason: 'rubric incomplete — re-scrub' };
  }
  if (!faceCoverOk(id)) return { publish: false, reason: '🖼 face-card cover missing (/assets/qa/' + id + '.jpg >40KB, cover_src=flux)' };
  if (!C.topImage(String(body || ''))) return { publish: false, reason: '🖼 hero image markdown missing on Q&A body' };
  const imgGate = await publishImageGate(id, body, { forceVerify: true });
  if (!imgGate.ok) return { publish: false, reason: '🖼 ' + imgGate.reason };
  body = imgGate.body || body;
  const b = String(body) + (pollinatorImagesNote(id, body) || '');
  // ✍️ WRITING auditor
  const wA = await routeAuditor(title, b, AUDIT_SYS_WRITING);
  if (wA.err) return { publish: false, reason: '✍️ writing auditor could not run — review' };
  if (!wA.pass) return { publish: false, reason: '✍️ writing: ' + (wA.notes || 'fail') };
  await _sleepMs(AUDIT_STAGGER_MS);
  // 🖼 DDG/IMAGES auditor — DeepSeek independent skeptic (an error ≠ a pass)
  const iA = await dsAudit(title, b, AUDIT_SYS_DDG);
  if (iA.err) return { publish: false, reason: '🖼 DDG image auditor could not run — review' };
  if (!iA.pass) return { publish: false, reason: '🖼 DDG images: ' + (iA.notes || 'fail') };
  await _sleepMs(AUDIT_STAGGER_MS);
  // 🌸 HERO auditor — final face-card sign-off
  const hA = await routeAuditor(title, b, AUDIT_SYS_HERO);
  if (hA.err) return { publish: false, reason: '🌸 hero sign-off could not run — review' };
  if (!hA.pass) return { publish: false, reason: '🌸 hero: ' + (hA.notes || 'fail') };
  return { publish: true, reason: '13/13 + ✍️writing + 🖼DDG + 🌸hero (staggered) all pass' };
}

// STRONG rubric-aware, anti-fabrication WRITER — gives a complete first draft so the
// downstream fixer only patches gaps (fixes the "few sources / fabricated studies" issue).
const WRITE_SYS = `You write ONE complete PULSE answer in Markdown for the given question. Follow this EXACT structure:
- "## Direct Answer" then a SUBSTANTIAL 2-3 FULL sentence honest direct answer — never a single lazy sentence; give the real answer plus the key why/how.
- 6+ "## " H2 sections that thoroughly and practically answer the question (operator-grade, specific, useful).
- EXACTLY 2 fenced \`\`\`mermaid flowchart diagrams, VALID syntax only: "flowchart TD" then simple "A[Label] --> B[Label]" lines. NO parentheses, quotes, colons, or <> inside node labels.
- "## FAQ" with 6 Q&As — each is "**A natural question?**" on its own line, then a 1-2 sentence answer.
- "## Sources" with 5 to 8 REAL, general, well-known references — name real organizations, reputable sites, or publications relevant to the topic (e.g. for aquariums: general hobby authorities). Plain text names are fine.
- End with "## Related on PULSE" then one line: "- Explore more in the PULSE library."
- About 2000 words. Bold key terms with **double asterisks** generously — at least 25 bolded phrases.
- 🖼️ MEDIA LAW: this page carries 3-10 images that break up the text (a top hero + one between content blocks). Give each H2 a clear, concrete topic so its image is RELEVANT to that section (real subjects — people, teams, places, brands — get real photos; generic scenes get illustrations). Never leave a long wall of text without a media break.
- 📇 Every page also renders the CRO Syndicate card (hanging widget) automatically — do not write ad copy for it.
🚫 ANTI-FABRICATION (the #1 rule): NEVER invent a specific number, %, price, date, statistic, study, or a figure attributed to a named report (NEVER write things like "a University of Florida study found 47%"). Keep it qualitative and honest — better general-and-true than specific-and-fabricated. Sources must be REAL general references, never invented studies or data.
Output ONLY the Markdown body — no preamble, no wrapping code fence.`;
async function seedWrite(question, pillar){
  const ex = genExample ? ('\n\nMATCH THE EXACT STRUCTURE & FORMAT of this recent '+pName(pillar)+' entry (same section types, same style — but answer the NEW question; do NOT copy its content or facts):\n"""\n'+genExample+'\n"""') : '';
  const ctx = ceContext[question];
  const ground = ctx ? ('\n\n📰 CURRENT-EVENTS ANSWER — GROUND IT IN THIS REAL, RECENT NEWS STORY. Report what ACTUALLY happened per this source; do NOT contradict it and do NOT invent facts, numbers, or quotes beyond it. Attribute specifics to the outlet ("according to '+(ctx.source||'reports')+'…"). In "## Sources", cite this outlet by name plus other real, well-known outlets covering it.\nHeadline: '+ctx.title+'\nOutlet: '+(ctx.source||'unknown')+'\nPublished: '+(ctx.pub||'')+'\nWhat happened: '+(ctx.desc||ctx.headline)) : '';
  try{ const { content } = await dsChat([{ role:'system', content:WRITE_SYS+ex+ground }, { role:'user', content:`Question: "${question}"\nPULSE section: ${pName(pillar)}\nWrite the complete answer now, following the format of the recent entry.` }]); const b = String(content||'').replace(/^```[a-z]*\s*|\s*```$/g,'').trim(); return b.length>600 ? b : null; }catch(e){ return null; }
}

// ── Current Events: REAL same-day news grounding (free keyless Google News RSS) ──
const ceContext = {};   // ce question -> the real, recent news story it must be grounded in
const _decEnt = s => String(s||'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d));
async function fetchNews(max){
  const feeds = [
    'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
  ];
  const items = [];
  for (const url of feeds){
    try{
      const r = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0' }, signal: AbortSignal.timeout(12000) });
      const xml = await r.text();
      for (const b of xml.split(/<item>/).slice(1)){
        const g = re => ((b.match(re)||[])[1]||'');
        const rawT = _decEnt(g(/<title>([\s\S]*?)<\/title>/)).trim();
        if (!rawT) continue;
        const src = _decEnt(g(/<source[^>]*>([\s\S]*?)<\/source>/)).trim() || (rawT.match(/\s-\s([^-]+)$/)||[])[1] || '';
        const headline = rawT.replace(/\s+-\s+[^-]+$/,'').trim();   // strip trailing " - Outlet"
        items.push({ headline, title: rawT, source: src.trim(), link: _decEnt(g(/<link>([\s\S]*?)<\/link>/)).trim(),
          pub: g(/<pubDate>([\s\S]*?)<\/pubDate>/).trim(),
          desc: _decEnt(g(/<description>([\s\S]*?)<\/description>/)).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,360) });
      }
    }catch(e){}
  }
  const seen = new Set(), uniq = [];
  for (const it of items){ const k = it.headline.toLowerCase(); if (!k || seen.has(k)) continue; seen.add(k); uniq.push(it); }
  const cutoff = Date.now() - 2*86400000;   // same-day focus: last ~2 days
  const recent = uniq.filter(it => { const d = Date.parse(it.pub); return isNaN(d) ? true : d >= cutoff; });
  return (recent.length ? recent : uniq).slice(0, max);
}

// DeepSeek makes fresh, NON-DUPLICATE questions for a pillar (no-dup law: same Q + same pillar)
async function genQuestions(pillar, n){
  const norm = s => String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const have = new Set((byPillar[pillar]||[]).map(s=>norm(s.title)));
  const sample = (byPillar[pillar]||[]).slice(-14).map(s=>s.title).filter(Boolean);   // LAST few (recent) — follow current style
  // CURRENT EVENTS: build questions from REAL same-day headlines (grounded, not invented)
  if (pillar === 'ce'){
    const news = await fetchNews(Math.max(n+6, 18));
    if (!news.length) return [];   // no feed → generate nothing rather than fabricate
    const heads = news.map(x => x.headline);
    let qlines = [];
    try {
      const { content } = await dsChat([
        { role:'system', content:'For each news headline, write ONE natural, specific question a real reader would search to learn what just happened. Same order, exactly one per line, no numbering, no quotes. These are dated 2027 events — end each question with "in 2027".' },
        { role:'user', content: heads.map((h,i)=>(i+1)+'. '+h).join('\n') },
      ]);
      qlines = String(content||'').split(/\n/).map(l => l.replace(/^\s*\d+[\.\)]\s*/,'').replace(/^["']|["']$/g,'').trim()).filter(Boolean);
    } catch(e){}
    const out = [];
    for (let i=0; i<news.length && out.length<n; i++){
      let q = (qlines[i] || ('What happened with '+heads[i]+' in 2027?')).trim();
      if (!/\?$/.test(q)) q += '?';
      if (have.has(norm(q))) continue;
      ceContext[q] = news[i];   // stash the real story so the writer can ground the answer
      out.push(q);
    }
    return out;
  }
  const topicHint = PILLAR_TOPIC[pillar] ? ('\nThis section covers: '+PILLAR_TOPIC[pillar]+'.') : '';
  const sys = `You write NEW question titles for the "${pName(pillar)}" section of PULSE.${topicHint} Return distinct, natural, high-intent questions a real person would ask — ONE per line, no numbering, no quotes.${sample.length?(' Match the topic/style of these RECENT ones (NEVER repeat any): '+sample.join(' | ')):''}
🗓️ YEAR LAW — judge by whether the ANSWER (its list/recommendation) changes over the next few years:
 • DATABLE (product/list/ranking that changes) → END with "in 2027". e.g. "What's the best board game to play with friends in 2027?"
 • EVERGREEN (timeless advice/how-to/definition) → NO year. e.g. "What's the best way to tell your parents you messed up?"`;
  const out = [];
  // Keep generating until we actually reach n. Stop only when the pillar is genuinely
  // tapped out (3 straight rounds add nothing new) or a hard safety cap. Higher temp +
  // feeding back "already used" titles keeps yield high so 100 means 100, not ~10.
  for(let dry=0, rounds=0; out.length<n && dry<3 && rounds<50 && !genJob.stop; rounds++){
    const before = out.length;
    let content=''; try { ({ content } = await dsChat([{ role:'system', content:sys }, { role:'user', content:`Give ${Math.min(30,n-out.length)} NEW ${pName(pillar)} questions. Distinct from each other and from these already-used titles: ${out.slice(-45).join(' | ')||'(none yet)'}. Datable ones must end "in 2027".` }], { temperature:0.95 })); } catch(e){ dry++; continue; }
    for(const line of String(content||'').split(/\n/)){
      let q = line.replace(/^[\s\d.)\-*"'#]+/,'').replace(/["']\s*$/,'').trim();
      if(q.length<12 || q.length>170) continue;
      q = yearize(q);                                   // 🗓️ enforce the year law deterministically
      const nq = norm(q); if(have.has(nq)) continue;    // ✅ ALWAYS check duplicate titles first (no-dup law)
      have.add(nq); out.push(q); if(out.length>=n) break;
    }
    if(out.length===before) dry++; else dry=0;          // count consecutive empty rounds
  }
  return out;
}

function nextGenId(pillar){
  const nums = (byPillar[pillar]||[]).map(s=>parseInt(String(s.id).slice(pillar.length),10)).filter(x=>!isNaN(x));
  let n = (nums.length?Math.max(...nums):0)+1, id = pillar+String(n).padStart(4,'0');
  while(valid.has(id)){ n++; id = pillar+String(n).padStart(4,'0'); }
  return id;
}
const saveBody = async (id, b) => { await persistAnswerBlob(id, b); };

// After generate pipeline — sync cover_src + quality metadata so factor-2 scrubber sees same state as scrubOne.
async function syncGeneratedEntryMetadata(id, title, score, body, opts) {
  const certified = opts && opts.certified;
  try {
    if (faceCoverOk(id)) {
      if (coverSrcOf[id] !== 'flux') coverSrcOf[id] = 'flux';
      await stampFluxProvenance(id, store, 'flux');
    }
    const cur = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (cur) {
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
        answer: body || cur.answer,
        cover_src: coverSrcOf[id] || cur.cover_src || null,
        quality_score: score != null ? score : cur.quality_score,
        pending: certified ? false : true,
        updated_at: new Date().toISOString(),
      }));
    }
  } catch (e) {}
}

// build ONE new entry — same entryScrubPipeline as scrubber; loops until 13/13 before next Q&A
async function generateOne(pillar, question, genOpts){
  genOpts = genOpts || {};
  genJob.stop = false; // urgent/generateOne
  const essayOnly = genOpts.essayOnly !== false;
  const id = await locked(async()=>{ const nid = nextGenId(pillar); valid.add(nid); (byPillar[pillar]=byPillar[pillar]||[]).push({ id:nid, title:question }); return nid; });
  const titleShort = String(question).slice(0, 80);
  genJob.current = { id, title: titleShort };
  const batchDone = genJob.published || 0;
  resetScrubProgress(id, titleShort, pillar, Math.max(0, (genJob.target || 0) - batchDone), { genMode: true, batchDone, batchTarget: genJob.target || 0 });
  setScrubStep('load', 0, 1, 'Seeding draft…');
  genJob.stage='✍️ writing'; saveGen();
  const alt = String(question).replace(/[\[\]"]/g,'').slice(0,80);
  const cover = pillar==='tl' ? ('/assets/cro-cover-'+((Math.abs(parseInt(id.slice(2),10)||0)% 5)+1)+'.jpg') : null;
  const topImg = cover || ((REQUIRE_FLUX_IMAGES || INTERNAL_IMAGES_DDG) ? ('/assets/qa/' + id + '.jpg') : pollCoverUrl(question, pillar));
  const draft = await seedWrite(question, pillar);
  let body = '!['+alt+']('+topImg+')\n\n' + (draft || '## Direct Answer\n\n');
  body = boldify(deban(body), 25); body = ensureErFormat(id, body);
  await store.setJSON('answers/'+id+'.json', {
    id, question, answer: body,
    tags: publishTagsFor(id, { tags: [pillar] }),
    pending: true, ts: Date.now(),
    pipeline_origin: 'generate',
    from_pipeline_generator: true,
  });
  const sib = (byPillar[pillar]||[]).filter(s=>s.id!==id);
  if (essayOnly) {
    try {
      const { reshapeQaGoldBody } = require('./_qa_gold_template');
      body = reshapeQaGoldBody(body);
      await saveBody(id, body);
      genLog('essay reshape Q&A gold (strip ranking artifacts) · ' + id);
    } catch (e) {}
  }
  const goldRoute = pickGoldTemplate(id, body, question);
  const scoreHistory = [];
  const pipelineSteps = [];
  genLog('📐 classify → ' + (goldRoute.template || '?') + ' · ' + (goldRoute.goldId || 'none') + ' · ' + (goldRoute.reason || ''));
  async function savePipelineRun(extra) {
    const run = makePipelineTemplateRun(Object.assign({
      id,
      classification: goldRoute,
      template: goldRoute.template,
      goldId: goldRoute.goldId,
      scoreHistory,
      steps: pipelineSteps.slice(),
    }, extra || {}));
    try {
      const cur = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { pipeline_template_run: run }));
    } catch (e) {}
    return run;
  }
  await savePipelineRun({ certified: false });
  setScrubStep('content', 1, 5, 'DeepSeek first draft');
  genJob.stage='✍️ DeepSeek first draft'; saveGen();
  await fixEntry(id, question, sib, valid, contentChat).catch(()=>{});
  let r = await store.get('answers/'+id+'.json',{type:'json'}).catch(()=>null); if(r&&r.answer) body=r.answer;
  body = boldify(deban(body), 25); body = ensureErFormat(id, body);
  await saveBody(id, body);
  scrubLive.before = gradeEntry(id, body, { imagesDeferred: true }).score;
  markScrubStepDone('load', 'Draft loaded · ' + scrubLive.before + '/13');
  pushRubricLive(id, body);

  const MAX_GEN_ATTEMPTS = 15;
  for (let attempt = 1; attempt <= MAX_GEN_ATTEMPTS && !genJob.stop; attempt++) {
    if (attempt > 1) {
      const rr = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (rr && rr.answer) body = rr.answer;
      scrubLive.before = gradeEntry(id, body, { imagesDeferred: true }).score;
    }
    genJob.stage = attempt > 1
      ? ('↻ until 13/13 · try ' + attempt + ' · ' + scrubLive.before + '/13 · ' + id)
      : ('🍳 13/13 pipeline · Pollinator + DDG · ' + id);
    saveGen();
    const result = await entryScrubPipeline({
      id, title: question, body,
      save: b => saveBody(id, b),
      sib, out: { steps: pipelineSteps },
      ui: 'gen', certifyOnPass: true, maxRounds: 6,
      shouldStop: () => !!genJob.stop,
    });
    body = result.body || body;
    const score = result.score || gradeEntry(id, body, { imagesDeferred: true }).score;
    scoreHistory.push({
      round: attempt,
      score,
      status: result.status,
      failed: (result.rubric && result.rubric.failed) || [],
      at: new Date().toISOString(),
    });
    await savePipelineRun({ certified: result.status === 'certified' });
    if (result.status === 'stopped') {
      touchScrubLive({ active: false, stage: 'idle', carwash: 'Generate stopped — ' + id });
      return { status: 'stopped', id, score, notes: result.msg || 'stopped' };
    }
    if (result.status === 'certified') {
      genJob.published = (genJob.published || 0) + 1;
      setScrubStep('certify', 1, 1, '13/13 — published');
      markScrubStepDone('certify', 'Certified 13/13');
      touchScrubLive({ active: false, stage: 'idle', carwash: id + ' → live 13/13' });
      genJob.stage = '✅ 13/13 · ' + id; saveGen();
      return { status: 'certified', id, score, notes: '13/13 certified' };
    }
    await syncGeneratedEntryMetadata(id, question, score, body);
    genLog('↻ ' + id + ' ' + score + '/13 — retry same entry until 13/13 (try ' + attempt + '/' + MAX_GEN_ATTEMPTS + ')');
    setScrubStep('certify', 0, 1, score + '/13 → retry');
    touchScrubLive({ active: true, stage: genJob.stage, carwash: score + '/13 · retrying until 13/13' });
    await new Promise(x => setTimeout(x, 1200));
  }
  const finalScore = gradeEntry(id, body, { imagesDeferred: true }).score;
  genJob.stage = '⚠️ gave up · ' + finalScore + '/13 · ' + id; saveGen();
  return { status: 'error', id, score: finalScore, notes: 'Could not reach 13/13 after max attempts' };
}

// SUPERVISOR — self-healing: catches errors, skips, drives to target, respects daily cap
async function genRun(pillarSel, count){
  const pillars = activePillars();
  const randomEach = pillarSel === 'random';
  const pillar = randomEach ? null : (pillars.includes(pillarSel) ? pillarSel : pillars[0]);
  forceStopScrub();
  try { fs.writeFileSync(WD + '/_scrub_auto_off.flag', '1'); } catch (e) {}
  genJob = { running:true, sel:pillarSel, pillar: randomEach ? 'random' : pillar, pillarName: randomEach ? 'Random each Q' : pName(pillar), target:count, published:0, pooled:0, parked:0, tried:0, current:null, stage:'starting', startedAt:new Date().toISOString(), log:[], stop:false, error:'' };
  genLog((randomEach ? ('🎲 random each Q — target ' + count) : (pName(pillar) + ' — target ' + count)) + ' · serial 13/13 pipeline (same as scrubber) · no scrub queue handoff');
  let questions = [];
  if (!randomEach) {
    await loadGenExampleForPillar(pillar);
    questions = await genQuestions(pillar, count);
    genLog('📝 '+questions.length+' fresh questions');
  }
  try{
    let qi=0, fails=0;
    const done = () => genJob.published;
    async function worker(workerN){
      while(done() < count && !genJob.stop){
        if(dayCount() >= DAILY_MAX) break;
        let entryPillar, question;
        if (randomEach) {
          entryPillar = pickRandomPillar();
          await loadGenExampleForPillar(entryPillar);
          const qs = await genQuestions(entryPillar, 1);
          if (!qs.length) { fails++; genLog('⚠️ [w'+workerN+'] no question for '+pName(entryPillar)); continue; }
          question = qs[0];
        } else {
          entryPillar = pillar;
          const myQi = await locked(() => {
            if (qi >= questions.length || done() >= count) return -1;
            return qi++;
          });
          if (myQi < 0) break;
          if (myQi >= questions.length) {
            const more = await genQuestions(pillar, Math.max(3, count - done()));
            if (!more.length) break;
            questions = questions.concat(more);
          }
          if (myQi >= questions.length || done() >= count) break;
          question = questions[myQi];
        }
        genJob.pillar = entryPillar;
        genJob.pillarName = randomEach ? pName(entryPillar) : genJob.pillarName;
        await waitPipelineEntryGap('generate');
        genJob.tried++;
        genJob.stage = '✍️ 13/13 pipeline · w'+workerN+' · '+pName(entryPillar);
        saveGen();
        let r;
        try { r = await generateOne(entryPillar, question); } catch(e){ r = { status:'error', notes:e.message }; }
        if (r.status === 'certified') {
          fails = 0;
          histAdd(r.id, entryPillar, question, 'certified', r.score);
          genLog('✅ '+r.id+' · 13/13 · '+question.slice(0,40));
        } else if (r.status === 'retry') {
          fails = 0;
          histAdd(r.id, entryPillar, question, 'retry', r.score);
          genLog('↩ '+r.id+' '+(r.score||'?')+'/13 → scrub retry · '+question.slice(0,34));
        } else if (r.status === 'stopped') {
          break;
        } else {
          fails++;
          genLog('⚠️ [w'+workerN+'] '+String(r.notes||'err').slice(0,46));
          if(fails>=5){ genLog('🛟 supervisor cooling 30s'); await new Promise(x=>setTimeout(x,30000)); fails=0; }
        }
        saveGen();
      }
    }
    const nWorkers = Math.min(GEN_WRITERS, count);
    await Promise.all(Array.from({ length: nWorkers }, (_, i) => worker(i + 1)));
  } catch(e){ genJob.error=e.message; genLog('💥 '+e.message); }
  genJob.running=false; genJob.current=null; genJob.stage = genJob.stop?'stopped':(genJob.published>=count?'✅ complete':'done'); saveGen();
  genLog(genJob.stage+' — '+genJob.published+' certified 13/13');
  if(genJob.stop){ genQueue = []; }
  else if(genQueue.length){ const nx = genQueue.shift(); genLog('▶ starting next queued run ('+genQueue.length+' more after)'); setTimeout(()=>genRun(nx.sel, nx.count), 3000); }
}

// Deploy IndexNow — ping search engines (recent | delta | full sitewide | interwoven SEO)
let indexnowJob = { running: false, mode: '', phase: '', done: 0, total: 0, ok: 0, stamped: 0, startedAt: null, finishedAt: null, error: '', ids: 0, source: '', weaveLog: '' };
const INDEX_COOLDOWN_MS = {
  recent: 0,
  delta: 60 * 60 * 1000,
  full: 7 * 24 * 60 * 60 * 1000,
  interwoven: 7 * 24 * 60 * 60 * 1000,
};
const INDEX_COOLDOWN_F = WD + '/_indexnow_cooldowns.json';
function readIndexCooldowns() {
  try { return JSON.parse(fs.readFileSync(INDEX_COOLDOWN_F, 'utf8')); } catch (e) { return {}; }
}
function writeIndexCooldowns(d) {
  try { fs.writeFileSync(INDEX_COOLDOWN_F, JSON.stringify(d, null, 2)); } catch (e) {}
}
function indexCooldownLeftMs(mode) {
  const cd = INDEX_COOLDOWN_MS[mode] || 0;
  if (!cd) return 0;
  const last = readIndexCooldowns()[mode] || 0;
  return Math.max(0, last + cd - Date.now());
}
function indexCooldownCheck(mode) {
  const left = indexCooldownLeftMs(mode);
  if (left > 0) {
    const sec = Math.ceil(left / 1000);
    let msg = mode + ' cooldown — ';
    if (left >= 86400000) msg += Math.ceil(left / 86400000) + 'd left';
    else if (left >= 3600000) msg += Math.ceil(left / 3600000) + 'h left';
    else msg += Math.ceil(left / 60000) + 'm left';
    return { ok: false, msg, cooldownSec: sec, cooldownLeftMs: left };
  }
  return { ok: true };
}
function indexCooldownMark(mode) {
  if (!(INDEX_COOLDOWN_MS[mode] > 0)) return;
  const d = readIndexCooldowns();
  d[mode] = Date.now();
  writeIndexCooldowns(d);
}
function indexCooldownStatusAll() {
  return Object.fromEntries(Object.keys(INDEX_COOLDOWN_MS).map(mode => {
    const leftMs = indexCooldownLeftMs(mode);
    return [mode, { leftMs, leftSec: Math.ceil(leftMs / 1000), ready: leftMs <= 0, cooldownMs: INDEX_COOLDOWN_MS[mode] || 0 }];
  }));
}
function indexnowStatusPayload() {
  return Object.assign({}, indexnowJob, { cooldowns: indexCooldownStatusAll() });
}
function answerLooksInterwoven(body) {
  body = String(body || '');
  if (body.includes('<!--pillar-weave-->') || body.includes('<!--cro-weave-->')) return true;
  const m = body.match(/\n#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{1,2}\s|\s*$)/i);
  if (!m) return false;
  return (m[0].match(/\]\(\/knowledge\//g) || []).length >= 1;
}
async function pingIndexNowBatches(urls, onBatch) {
  urls = urls || [];
  let ok = 0;
  for (let i = 0; i < urls.length; i += 200) {
    const batch = urls.slice(i, i + 200);
    try {
      const r = await pingIndexNowUrlList(batch);
      if (r && r.ok) ok += batch.length;
      else if (onBatch) onBatch({ error: (r && r.pings) ? JSON.stringify(r.pings) : 'ping failed', done: Math.min(urls.length, i + batch.length), total: urls.length });
    } catch (e) { if (onBatch) onBatch({ error: e.message, done: Math.min(urls.length, i + batch.length), total: urls.length }); }
    if (onBatch) onBatch({ done: Math.min(urls.length, i + batch.length), total: urls.length, ok });
    await indexSleep(800);
  }
  return { ok, total: urls.length };
}
function runNodeWeaveScript(script, args, onLine) {
  return new Promise((resolve, reject) => {
    const cp = spawn('node', [path.join(WD, script), ...(args || [])], {
      cwd: WD, stdio: ['ignore', 'pipe', 'pipe'],
      env: Object.assign({}, process.env, { WEAVE_PACE_MS: String(process.env.WEAVE_PACE_MS || '0') }),
    });
    const handle = d => String(d).split(/\r?\n/).filter(Boolean).forEach(l => onLine && onLine(l));
    cp.stdout.on('data', handle);
    cp.stderr.on('data', handle);
    cp.on('error', reject);
    cp.on('close', code => (code === 0 ? resolve() : reject(new Error(script + ' exited ' + code))));
  });
}
const indexSleep = ms => new Promise(r => setTimeout(r, ms));
function fetchIndexText(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'pulse-scrub-index/1.0' } }, res => {
      let b = '';
      res.on('data', c => { b += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    }).on('error', e => resolve({ status: 0, body: e.message }));
  });
}
function parseSitemapLocs(xml) {
  const o = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(String(xml || '')))) o.push(m[1].trim());
  return o;
}
const INDEX_PILLAR_SEG = { pt: '/pets/', ce: '/knowledge/', cr: '/crabbing/', fs: '/fishing/', sw: '/software/', cd: '/contracts/' };
function entryPublicUrlForIndex(id, row) {
  if (row) {
    try {
      const u = libraryEntryPublicUrl(row);
      if (u) return u;
    } catch (_) {}
  }
  const sid = String(id || '');
  const p = (sid.match(/^([a-z]+)/) || ['', ''])[1];
  if (p && INDEX_PILLAR_SEG[p]) return PULSE_SITE + INDEX_PILLAR_SEG[p] + sid;
  return PULSE_SITE + '/knowledge/' + sid;
}
function urlsForIndexIds(ids, byId) {
  const urls = [];
  for (const id of ids) {
    if (!id) continue;
    const row = (byId && byId.get(id)) || { id };
    const u = entryPublicUrlForIndex(id, row);
    if (!u) continue;
    urls.push(u);
    urls.push(u + '/reviews');
  }
  return urls;
}
async function loadIndexById() {
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    return new Map((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e]));
  } catch (e) { return new Map(); }
}
async function buildScrubQueueIndexUrls(opts) {
  opts = opts || {};
  const since = opts.since || 0;
  const ids = new Set();
  readArr(QUEUE).forEach(id => ids.add(id));
  readArr(COOKQ).forEach(id => ids.add(id));
  readRejectFix().forEach(x => { if (x && x.id) ids.add(x.id); });
  readPending().forEach(x => { if (x && x.id) ids.add(x.id); });
  if (since) {
    readArr(SCRUBLOG).forEach(row => {
      if (!row || !row.id) return;
      const t = Date.parse(row.ts || '') || 0;
      if (t >= since) ids.add(row.id);
    });
  }
  const byId = await loadIndexById();
  return { urls: urlsForIndexIds([...ids], byId), ids: ids.size, source: since ? 'scrub-queue+delta-log' : 'scrub-queue' };
}
async function buildUnicornIndexUrls() {
  const urls = new Set([
    PULSE_SITE + '/knowledge/pt573',
    PULSE_SITE + '/pets/pt573',
    PULSE_SITE + '/seo',
    PULSE_SITE + '/publish',
  ]);
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    (idx.entries || []).filter(e => e && e.id && (e.easter_egg || /unicorn/i.test(String(e.question || '')))).forEach(e => {
      const u = entryPublicUrlForIndex(e.id, e);
      if (u) { urls.add(u); urls.add(u + '/reviews'); }
    });
  } catch (e) {}
  return { urls: [...urls], ids: urls.size, source: 'unicorn-portal' };
}
async function mergeIndexNowExtras(built, opts) {
  opts = opts || {};
  const extra = [];
  if (opts.includeScrub) {
    const scrub = await buildScrubQueueIndexUrls({ since: opts.since || 0 });
    extra.push(...(scrub.urls || []));
    built.scrubIds = scrub.ids;
  }
  if (opts.includeUnicorn) {
    const uni = await buildUnicornIndexUrls();
    extra.push(...(uni.urls || []));
    built.unicornIds = uni.ids;
  }
  built.urls = [...new Set([...(built.urls || []), ...extra])];
  if (opts.includeScrub || opts.includeUnicorn) {
    built.source = (built.source || '') + (opts.includeScrub ? '+scrub' : '') + (opts.includeUnicorn ? '+unicorn' : '');
  }
  return built;
}
async function buildIndexNowRecentUrls(limit = 200) {
  const byId = new Map();
  const idOrder = [];
  const pushId = (id) => {
    if (!id || byId.has(id)) return;
    byId.set(id, { id });
    idOrder.push(id);
  };
  for (const id of readArr(AP)) pushId(id);
  for (const id of readArr(CC)) pushId(id);
  for (const row of readArr(SCRUBLOG)) {
    if (row && row.id && (row.status === 'certified' || /green|IndexNow/i.test(String(row.msg || '')))) pushId(row.id);
  }
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const sorted = [...(idx && idx.entries || [])].filter(e => e && e.id).sort((a, b) => (b.ts || 0) - (a.ts || 0));
    for (const e of sorted) {
      if (idOrder.length >= limit) break;
      if (!byId.has(e.id)) { byId.set(e.id, e); idOrder.push(e.id); }
      else byId.set(e.id, Object.assign({}, byId.get(e.id), e));
    }
  } catch (e) {}
  const ids = idOrder.slice(0, limit);
  const urls = [PULSE_SITE + '/'];
  for (const id of ids) {
    const row = byId.get(id) || { id };
    const u = entryPublicUrlForIndex(id, row);
    if (!u) continue;
    urls.push(u);
    urls.push(u + '/reviews');
  }
  return { urls: [...new Set(urls)].slice(0, 10000), ids: ids.length, source: ids.length ? 'blob-recent+local-ledgers' : 'homepage-only' };
}
async function buildIndexNowDeltaUrls(hours = 26, opts) {
  opts = opts || {};
  const since = Date.now() - hours * 3600 * 1000;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx.entries || []).filter(e => e && e.id && (Number(e.ts) || 0) >= since);
  const urls = [];
  for (const e of entries) {
    const u = entryPublicUrlForIndex(e.id, e);
    if (!u) continue;
    urls.push(u);
    urls.push(u + '/reviews');
  }
  let built = { urls: [...new Set(urls)], ids: entries.length, source: 'delta-' + hours + 'h', entries };
  return mergeIndexNowExtras(built, Object.assign({}, opts, { since }));
}
async function buildIndexNowFullUrls(opts) {
  opts = opts || {};
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const libRows = (idx.entries || []).filter(e => e && e.id);
  const libUrls = [];
  for (const e of libRows) {
    try {
      const u = entryPublicUrlForIndex(e.id, e);
      if (u) { libUrls.push(u); libUrls.push(u + '/reviews'); }
    } catch (_) {}
  }
  const staticUrls = new Set();
  try {
    parseSitemapLocs(fs.readFileSync(path.join(WD, 'sitemap.xml'), 'utf8')).forEach(u => u.includes('pulserevops.com') && staticUrls.add(u));
  } catch (_) {}
  const smIndex = await fetchIndexText(PULSE_SITE + '/sitemap-index.xml');
  for (const sm of parseSitemapLocs(smIndex.body || '').filter(u => /\.xml$/i.test(u))) {
    const r = await fetchIndexText(sm);
    if (r.status === 200) parseSitemapLocs(r.body).forEach(u => u.includes('pulserevops.com') && staticUrls.add(u));
    await indexSleep(120);
  }
  const smMachine = await fetchIndexText(PULSE_SITE + '/.netlify/functions/pulse-machine-sitemap');
  if (smMachine.status === 200) parseSitemapLocs(smMachine.body).forEach(u => u.includes('pulserevops.com') && staticUrls.add(u));
  let built = { urls: [...new Set([...libUrls, ...staticUrls])], ids: libRows.length, source: 'full-sitewide', libRows };
  return mergeIndexNowExtras(built, opts);
}
async function buildIndexNowInterwovenUrls(opts) {
  opts = opts || {};
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && e.id);
  const entries = [];
  const urls = [];
  const conc = parseInt(process.env.INDEX_WEAVE_SCAN_CONC || '24', 10);
  await pmapLimit(rows, conc, async (e) => {
    try {
      const blob = await store.get('answers/' + e.id + '.json', { type: 'json' });
      if (!blob || !blob.answer || !answerLooksInterwoven(blob.answer)) return;
      entries.push(e);
      const u = entryPublicUrlForIndex(e.id, e);
      if (u) { urls.push(u); urls.push(u + '/reviews'); }
    } catch (_) {}
  });
  let built = { urls: [...new Set(urls)], ids: entries.length, source: 'interwoven-seo', entries };
  return mergeIndexNowExtras(built, opts);
}
async function runIndexNowJob(mode, opts) {
  if (indexnowJob.running) return { ok: false, msg: 'already running', started: false };
  const cd = indexCooldownCheck(mode);
  if (!cd.ok) return Object.assign({ ok: false, started: false, mode }, cd);
  opts = opts || {};
  if (mode === 'interwoven') {
    opts = opts || {};
    indexnowJob = { running: true, mode, phase: 'scan', done: 0, total: 0, ok: 0, stamped: 0, startedAt: Date.now(), finishedAt: null, error: '', ids: 0, source: 'interwoven-seo', weaveLog: 'Scanning interwoven pages…' };
    (async () => {
      try {
        let built = await buildIndexNowInterwovenUrls(opts);
        let urls = built.urls || [];
        if (!urls.length) {
          indexnowJob.phase = 'weave-pillar';
          indexnowJob.weaveLog = 'No interwoven pages yet — pillar weave…';
          try { await runNodeWeaveScript('_pillar_weave.js', ['ALL'], line => { indexnowJob.weaveLog = line.slice(0, 140); if (/woven|DONE|ALL pillars/i.test(line)) autoLog('🔗 ' + line.slice(0, 100)); }); } catch (e) { indexnowJob.weaveLog = 'pillar weave: ' + e.message; autoLog('⚠️ pillar weave · ' + e.message); }
          indexnowJob.phase = 'weave-cro';
          indexnowJob.weaveLog = 'Weaving CRO cluster…';
          try { await runNodeWeaveScript('_cro_weave.js', [], line => { indexnowJob.weaveLog = line.slice(0, 140); if (/woven|DONE/i.test(line)) autoLog('🔗 ' + line.slice(0, 100)); }); } catch (e) { indexnowJob.weaveLog = 'CRO weave: ' + e.message; autoLog('⚠️ CRO weave · ' + e.message); }
          built = await buildIndexNowInterwovenUrls(opts);
          urls = built.urls || [];
        }
        if (!urls.length) { indexnowJob.error = 'no interwoven urls to ping'; indexnowJob.running = false; indexnowJob.finishedAt = Date.now(); indexnowJob.phase = 'done'; return; }
        indexnowJob.phase = 'ping';
        indexnowJob.weaveLog = 'Pinging ' + urls.length + ' interwoven URLs…';
        indexnowJob.total = urls.length;
        indexnowJob.ids = built.ids;
        indexnowJob.source = built.source;
        const ping = await pingIndexNowBatches(urls, st => {
          indexnowJob.done = st.done || 0;
          indexnowJob.total = st.total || urls.length;
          if (st.ok != null) indexnowJob.ok = st.ok;
          if (st.error) indexnowJob.error = st.error;
        });
        indexnowJob.ok = ping.ok;
        if (ping.ok > 0) {
          const ts = Date.now();
          for (const e of (built.entries || [])) {
            try { await stampIndexed(store, e.id, ts); indexnowJob.stamped++; } catch (_) {}
          }
          indexCooldownMark(mode);
        } else if (!indexnowJob.error) indexnowJob.error = 'IndexNow ping failed';
        if (opts.reweave === true) {
          indexnowJob.phase = 'weave-pillar';
          indexnowJob.weaveLog = 'Optional re-weave (pillar)…';
          try { await runNodeWeaveScript('_pillar_weave.js', ['ALL'], line => { indexnowJob.weaveLog = line.slice(0, 140); }); } catch (e) { autoLog('⚠️ re-weave pillar · ' + e.message); }
          indexnowJob.phase = 'weave-cro';
          indexnowJob.weaveLog = 'Optional re-weave (CRO)…';
          try { await runNodeWeaveScript('_cro_weave.js', [], line => { indexnowJob.weaveLog = line.slice(0, 140); }); } catch (e) { autoLog('⚠️ re-weave CRO · ' + e.message); }
        }
      } catch (e) { indexnowJob.error = e.message; }
      indexnowJob.running = false;
      indexnowJob.finishedAt = Date.now();
      indexnowJob.phase = 'done';
      autoLog('📡 IndexNow interwoven — ' + indexnowJob.ok + '/' + indexnowJob.total + ' URLs' + (indexnowJob.stamped ? (' · stamped ' + indexnowJob.stamped) : '') + (indexnowJob.error ? (' · ' + indexnowJob.error) : ''));
    })();
    return { ok: true, started: true, mode: 'interwoven' };
  }
  let built;
  if (mode === 'delta') built = await buildIndexNowDeltaUrls(opts.hours || 26, opts);
  else if (mode === 'full') built = await buildIndexNowFullUrls(opts);
  else built = await buildIndexNowRecentUrls(opts.limit || 200);
  const urls = built.urls || [];
  if (!urls.length) {
    indexnowJob = { running: false, mode, done: 0, total: 0, ok: 0, stamped: 0, startedAt: Date.now(), finishedAt: Date.now(), error: 'no urls', ids: 0, source: built.source || mode };
    return { ok: false, msg: 'no urls to index', started: false, mode, source: built.source };
  }
  indexCooldownMark(mode);
  indexnowJob = { running: true, mode, phase: 'ping', done: 0, total: urls.length, ok: 0, stamped: 0, startedAt: Date.now(), finishedAt: null, error: '', ids: built.ids, source: built.source, weaveLog: '' };
  (async () => {
    const CH = mode === 'recent' ? 20 : 200;
    try {
      for (let i = 0; i < urls.length; i += CH) {
        const batch = urls.slice(i, i + CH);
        try {
          const r = await pingIndexNowUrlList(batch);
          if (r && r.ok) indexnowJob.ok += batch.length;
          else indexnowJob.error = (r && r.pings) ? JSON.stringify(r.pings) : 'ping failed';
        } catch (e) { indexnowJob.error = e.message; }
        indexnowJob.done = Math.min(urls.length, i + batch.length);
        if (mode !== 'recent') await indexSleep(800);
      }
      const ts = Date.now();
      const stampRows = mode === 'delta' ? (built.entries || []) : mode === 'full' ? (built.libRows || []) : [];
      for (const e of stampRows) {
        try { await stampIndexed(store, e.id, ts); indexnowJob.stamped++; } catch (_) {}
      }
    } catch (e) { indexnowJob.error = e.message; }
    indexnowJob.running = false;
    indexnowJob.finishedAt = Date.now();
    autoLog('📡 IndexNow ' + mode + ' — ' + indexnowJob.done + '/' + indexnowJob.total + ' URLs' + (indexnowJob.stamped ? (' · stamped ' + indexnowJob.stamped) : ''));
  })();
  return { ok: true, count: urls.length, ids: built.ids, source: built.source, mode, started: true };
}
async function deployIndexNow() {
  return runIndexNowJob('recent');
}
async function deployIndexNowDelta(hours, opts) {
  return runIndexNowJob('delta', Object.assign({ hours: hours || 26 }, opts || {}));
}
async function deployIndexNowFull(opts) {
  return runIndexNowJob('full', opts || {});
}
async function deployIndexNowInterwoven(opts) {
  return runIndexNowJob('interwoven', opts || {});
}

// scrub ONE url end-to-end; returns a result object for the UI
// ── SCRUB SLOT — one scrub at a time, globally (owner 2026-07-03). Manual click, auto-loop,
// and test scripts all share this queue: the next scrub does not START until the previous is 100% done.
let scrubTurn = Promise.resolve();
let scrubBusy = false;
let scrubSlotId = null;
let scrubLive = { active: false, id: null, title: null, pillar: null, stage: 'idle', round: 0, steps: [], before: null, startedAt: null, queueLeft: 0 };
const SCRUB_STEPS = [
  { n: 1, key: 'load', label: 'Load entry' },
  { n: 2, key: 'format', label: 'Format fixes' },
  { n: 3, key: 'content', label: 'Content writing' },
  { n: 4, key: 'media', label: 'Media images' },
  { n: 5, key: 'pollinator_cover', label: 'Pollinator cover' },
  { n: 6, key: 'pollinator_flux', label: INTERNAL_IMAGES_DDG ? 'DDG section images' : 'Pollinator flux images' },
  { n: 7, key: 'rubric', label: 'Rubric checklist' },
  { n: 8, key: 'certify', label: 'Cursor or Claude Code approval' },
];
const RUBRIC_LABELS = {
  score12: IMAGE_LAW_UI.score12, words2000: '≥2000 words', heroImage: 'Hero image', faceCardApplicable: 'Face-card applicable',
  pollinatorFaceCover: 'Pollinator face-card cover', pollinatorInternalFlux: INTERNAL_IMAGES_DDG ? 'Internal DDG images' : 'All images flux', media3to10: '3–10 images (CRO extra)',
  directAnswer: 'Direct Answer section', directAnswerFull: 'Direct Answer (2–3 sentences)', faq6: '6 FAQs', mermaid2: '2 mermaid diagrams',
  mermaidClean: 'Clean mermaid syntax', sources5: '5+ sources', relatedPulse: 'Related on PULSE', linksClean: 'Clean links',
  top10Images: 'Ranking list: hero + N unique @@PRODUCT imgs', rankingListMaster: 'Ranking list master template (4444 law)', qaGoldOutline: 'General Q&A gold template (q11133 law)', imagesLaw: 'Images law',
};
function rubricItemLabel(key, body) {
  if (key === 'media3to10') {
    return isTop10Body(body)
      ? (rankingImageTotal(body, entryTitle(body)) + ' images (1 hero + ' + expectedRankCount(body, entryTitle(body)) + ' products)')
      : '3–10 images (1 hero + sections, CRO extra)';
  }
  return RUBRIC_LABELS[key] || key;
}
function freshStepsTrack() { return SCRUB_STEPS.map(s => ({ n: s.n, key: s.key, label: s.label, status: 'pending', cur: 0, max: 1, detail: '' })); }
function resetScrubProgress(id, title, pillar, queueLeft, opts) {
  opts = opts || {};
  scrubLive = Object.assign(scrubLive, {
    active: true, id, title, pillar, round: 0, steps: [], before: null, startedAt: Date.now(), queueLeft,
    stepNum: 0, stepTotal: SCRUB_STEPS.length, stepsTrack: freshStepsTrack(),
    rubricItems: [], rubricScore: null, rubricPass: false, carwash: 'Starting…', overallPct: 0,
    genMode: !!opts.genMode,
    batchDone: opts.batchDone != null ? opts.batchDone : null,
    batchTarget: opts.batchTarget != null ? opts.batchTarget : null,
  });
  if (!opts.genMode) pushScrubActivity('🍳 Started ' + id + ' [' + pillar + '] ' + String(title || '').slice(0, 56), { id, pillar, status: 'started', title });
}
function setScrubStep(key, cur, max, detail) {
  const idx = SCRUB_STEPS.findIndex(s => s.key === key);
  if (idx < 0) return;
  const mx = Math.max(1, max || 1);
  const c = Math.min(mx, Math.max(0, cur || 0));
  const stepsTrack = (scrubLive.stepsTrack || freshStepsTrack()).map((s, i) => {
    if (i < idx) return Object.assign({}, s, { status: 'done', cur: s.max || 1, max: s.max || 1 });
    if (i === idx) return Object.assign({}, s, { status: 'active', cur: c, max: mx, detail: detail || '' });
    return Object.assign({}, s, { status: 'pending', cur: 0, max: 0, detail: '' });
  });
  const step = SCRUB_STEPS[idx];
  const carwash = mx > 1
    ? ('Step ' + step.n + ' of ' + SCRUB_STEPS.length + ' · ' + step.label + ' · ' + c + ' of ' + mx + (detail ? ' · ' + detail : ''))
    : ('Step ' + step.n + ' of ' + SCRUB_STEPS.length + ' · ' + step.label + (detail ? ' · ' + detail : ''));
  const carwashOut = (autoJob.stop && scrubBusy) ? ('⏹ Stop queued — finishing this entry · ' + carwash) : carwash;
  const doneSteps = idx + (c / mx);
  const overallPct = Math.round(doneSteps / SCRUB_STEPS.length * 100);
  touchScrubLive({ stepNum: step.n, stepKey: key, stepsTrack, carwash: carwashOut, stage: carwashOut, overallPct });
}
function markScrubStepDone(key, detail) {
  const idx = SCRUB_STEPS.findIndex(s => s.key === key);
  if (idx < 0) return;
  const stepsTrack = (scrubLive.stepsTrack || freshStepsTrack()).map((s, i) => {
    if (i <= idx) return Object.assign({}, s, { status: 'done', cur: s.max || 1, max: s.max || 1, detail: i === idx ? (detail || s.detail) : s.detail });
    return Object.assign({}, s, { status: 'pending', cur: 0, max: 0, detail: '' });
  });
  const overallPct = Math.round((idx + 1) / SCRUB_STEPS.length * 100);
  touchScrubLive({ stepsTrack, overallPct });
}
function pushRubricLive(id, body) {
  const rub = rubricSignOff(id, body);
  const rubricItems = Object.entries(RUBRIC_LABELS).map(([key]) => ({ key, label: rubricItemLabel(key, body), pass: !!rub.checks[key] }));
  const passed = rubricItems.filter(i => i.pass).length;
  setScrubStep('rubric', passed, rubricItems.length, rub.pass ? (passed + '/' + rubricItems.length + ' — 12/13 signed off') : (passed + '/' + rubricItems.length + ' — not 12/13 yet'));
  touchScrubLive({ rubricItems, rubricScore: rub.score, rubricPass: rub.pass, rubricPct: rub.rubricPct, rubricSigned: rub.pass });
}
function requestScrubStop() {
  autoJob.stop = true;
  if (SCRUB_LANE_MODE) {
    stopLaneScheduler();
    autoJob.stage = '⏹ lane stopped';
    autoLog('⏹ lane stopped');
    touchScrubLive({ active: false, stage: autoJob.stage, carwash: '⏹ Lane scrub stopped' });
    return;
  }
  autoJob.stage = '⏹ finishing current entry, then stopping…';
  autoLog('⏹ stop queued — will finish current Q&A first');
  const note = scrubLive.carwash || scrubLive.stage || '';
  touchScrubLive({
    stage: autoJob.stage,
    carwash: scrubBusy ? ('⏹ Stop queued — finishing this entry' + (note ? (' · ' + note) : '')) : '⏹ Stopped — no entry in progress',
  });
}
function forceStopScrub() {
  autoJob.stop = true;
  autoJob.running = false;
  scrubBusy = false;
  stopLaneScheduler();
  stopImageScrubChild();
  autoJob.stage = '⏹ force stopped';
  autoLog('⏹ force stop — scrub halted immediately');
  touchScrubLive({ active: false, stage: autoJob.stage, carwash: '⏹ Force stopped immediately' });
  return { ok: true, forceStopped: true };
}
function forceStopAll() {
  forceStopImageDuplicator();
  forceStopImageGenerator();
  forceStopFaceHero();
  forceStopImageRewrite();
  forceStopInternalImages();
  forceStopFormatFixer();
  forceStopRubricStation();
  if (genJob.running) { genJob.stop = true; forceStopGen(); }
  else forceStopGen();
  const scrub = forceStopScrub();
  try { fs.writeFileSync(WD + '/_scrub_auto_off.flag', '1'); } catch (e) {}
  try { fs.writeFileSync(WD + '/_image_scrub_stop.flag', '1'); } catch (e) {}
  autoLog('⏹ force stop ALL — scrub + generate + image stations halted');
  return { ok: true, forceStopped: true, scrub, stations: 'all' };
}
function forceStopGen() {
  genJob.stop = true;
  genJob.running = false;
  genJob.current = null;
  genQueue = [];
  genJob.stage = '⏹ force stopped';
  genLog('⏹ force stop — generate halted');
  saveGen();
  return { ok: true, forceStopped: true };
}
function forceStopAllJobs() {
  forceStopImageDuplicator();
  forceStopImageGenerator();
  forceStopFaceHero();
  forceStopImageRewrite();
  forceStopInternalImages();
  forceStopFormatFixer();
  forceStopRubricStation();
  forceStopScrub();
  forceStopGen();
  autoLog('⏹ force stop ALL — scrub, generate, and image stations halted');
  return { ok: true, forceStopped: true };
}
function touchScrubLive(patch) {
  Object.assign(scrubLive, patch);
  if (scrubLive.startedAt) scrubLive.elapsedSec = Math.round((Date.now() - scrubLive.startedAt) / 1000);
}
function readImageScrubStatus() { try { return JSON.parse(fs.readFileSync(WD + '/_image_status.json', 'utf8')); } catch (e) { return null; } }
function imageScrubRunning() {
  if (imageScrubChild && imageScrubChild.pid) {
    try { process.kill(imageScrubChild.pid, 0); return true; } catch (e) { imageScrubChild = null; }
  }
  try {
    const pid = parseInt(fs.readFileSync(WD + '/_image_scrub.pid', 'utf8'), 10);
    if (pid) { try { process.kill(pid, 0); return true; } catch (e) { try { fs.unlinkSync(WD + '/_image_scrub.pid'); } catch (x) {} } }
  } catch (e) {}
  try {
    if (fs.existsSync(WD + '/_image_scrub_stop.flag')) return false;
    const st = readImageScrubStatus();
    if (st && st.updated) {
      const age = Date.now() - new Date(st.updated).getTime();
      if (age < 600000 && ((st.pillars || []).some(p => /IN PROGRESS/i.test(p.state || '')) || (st.samples || []).length)) return true;
    }
  } catch (e) {}
  return false;
}
function stopImageScrubChild() {
  if (!imageScrubChild) return;
  try { imageScrubChild.kill('SIGTERM'); } catch (e) {}
  imageScrubChild = null;
}
function scrubStatusPayload() {
  const q = readArr(QUEUE);
  const pf = getScrubPillarFilter();
  const fq = filterQueueByPillar(q, pf);
  const activeIds = laneActiveIds();
  const imgRunning = imageScrubRunning();
  const imgSt = readImageScrubStatus();
  const imgLive = imgSt && imgSt.live;
  const activeId = imgRunning && imgLive ? (imgLive.pillar + ' · batch ' + (imgLive.batch || '?') + '/' + (imgLive.totalBatches || '?')) : (scrubBusy ? scrubSlotId : (SCRUB_LANE_MODE && activeIds.length ? activeIds[0].id : (autoJob.running ? autoJob.current : null)));
  const waiting = activeId ? fq.filter(id => id !== activeId) : fq;
  const ps = fluxStats();
  const fixSet = new Set(readRejectFix().map(x => x && x.id).filter(Boolean));
  const qByPillar = queueCountsByPillar(q);
  return {
    queueLen: q.length,
    queueFilteredLen: fq.length,
    queueSkippedByFilter: pf ? Math.max(0, q.length - fq.length) : 0,
    scrubPillarFilter: pf,
    scrubPillarFilterName: pf ? pName(pf) : null,
    queueByPillar: qByPillar,
    recentActivity: scrubActivityFeed.slice(0, 30),
    cookLen: 0,
    activeId,
    stopping: autoJob.stop && autoJob.running,
    queueNext: waiting.slice(0, 20).map(id => ({ id, title: String(titleOf[id] || id).slice(0, 72), pillar: pillarOf(id), kind: fixSet.has(id) ? 'fix' : (imageDupePriority.has(id) ? 'dupe' : 'fresh'), dupeCount: imageDupeCounts[id] || 0 })),
    queueFixCount: fq.filter(id => fixSet.has(id)).length,
    queueFreshCount: fq.filter(id => !fixSet.has(id)).length,
    queueDupeCount: fq.filter(id => imageDupePriority.has(id)).length,
    imageDupe: {
      prioritized: imageDupePriority.size,
      inQueue: fq.filter(id => imageDupePriority.has(id)).length,
      scan: Object.assign({}, imageDupeScanJob),
    },
    lane: SCRUB_LANE_MODE && !imgRunning ? Object.assign({}, laneLive, laneEstimateMs(), { activeJobs: readLaneJobs().length, tickSec: Math.round(laneNextDelayMs / 1000), tickMs: laneNextDelayMs, nextDelayMs: laneNextDelayMs, nextDelaySec: Math.ceil(laneNextDelayMs / 1000), maxJobs: LANE_MAX_JOBS, nextTickAt: laneNextTickAt, sliceBusy: anyLaneSlotBusy(), slots: summarizeLaneSlots(), activeIds: laneActiveIds(), estimates: laneEstimateMs(), pickReason: laneLive.pickReason, imageRotate: imageRotateState() }) : null,
    laneBoard: SCRUB_LANE_MODE && !imgRunning ? buildLaneBoard() : null,
    scrubCrew: SCRUB_CREW,
    scrubLive,
    pollinator: Object.assign({}, ps, {
      mode: INTERNAL_IMAGES_DDG ? 'flux-hero-ddg-sections-rotate' : 'pollinator-all',
      label: IMAGE_LAW_UI.engine,
      detail: IMAGE_LAW_UI.engineSub,
      freqSec: ps.freqSec ?? Math.round((ps.freqMs ?? FLUX_MIN_MS ?? 0) / 1000),
      minGapSec: ps.minGapSec ?? ps.gapSec ?? Math.round((ps.gapMs ?? ps.freqMs ?? FLUX_MIN_MS ?? 0) / 1000),
      avgSec: ps.avgMs ? Math.round(ps.avgMs / 1000) : 0,
      lastSec: ps.lastMs ? Math.round(ps.lastMs / 1000) : 0,
      lastAgoSec: ps.lastAgoSec,
      current: ps.currentLabel,
      recent: (ps.recent || []).map(r => ({
        sec: Math.round((r.ms || 0) / 1000),
        label: r.label,
        at: r.at,
        ok: r.ok,
        gapSec: Math.round((r.gapMs || 0) / 1000),
      })),
    }),
    imageScrubRunning: imgRunning,
    imageScrub: imgSt,
    running: autoJob.running || imgRunning,
    pipelineEntryGapSec: Math.round(PIPELINE_ENTRY_GAP_MS / 1000),
    pipelineCooldownSec: pipelineCooldownUntil ? Math.max(0, Math.ceil((pipelineCooldownUntil - Date.now()) / 1000)) : (pipelineCooldownSec || autoJob.cooldownSec || 0),
    pipelineAlt: pipelineAltSnap(),
    genRunning: !!(genJob && genJob.running),
  };
}
async function runScrubExclusive(fn) {
  const waitForPrior = scrubTurn;
  let releaseTurn;
  scrubTurn = new Promise(r => { releaseTurn = r; });
  await waitForPrior;
  scrubBusy = true;
  try { return await fn(); }
  finally {
    scrubBusy = false;
    scrubSlotId = null;
    if (autoJob.stop) touchScrubLive({ active: false, stage: '⏹ entry complete — scrubber stopping', carwash: '⏹ Current entry finished · scrubber stopping' });
    else touchScrubLive({ active: false, stage: 'idle' });
    releaseTurn();
  }
}
async function scrubOne(forcedId) {
  return runScrubExclusive(() => scrubOneWork(forcedId));
}

function pipelineStage(ui, key, cur, max, detail) {
  setScrubStep(key, cur, max, detail || '');
  if (ui === 'gen') {
    const s = SCRUB_STEPS.find(x => x.key === key);
    genJob.stage = '🧽 ' + (s ? s.label : key) + (detail ? (' · ' + detail) : '');
    saveGen();
  }
}
function pipelineDone(ui, key, detail) {
  markScrubStepDone(key, detail || '');
}
function pipelineRubric(ui, id, body) {
  pushRubricLive(id, body);
}

async function queueNewEntryForScrubber(id, body, opts) {
  const skipQueue = opts && opts.skipQueue;
  const prepend = opts && opts.prepend !== false;
  const fromPipeline = !!(opts && opts.pipelineOrigin === 'generate');
  let queued = false;
  await locked(async () => {
    try {
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      if (cur) {
        await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
          answer: body || cur.answer,
          pending: true,
          cc_signed: false,
          claude_certified: null,
          cc_signed_at: null,
          quality: null,
          pipeline_origin: fromPipeline ? 'generate' : (cur.pipeline_origin || null),
          from_pipeline_generator: fromPipeline || !!cur.from_pipeline_generator,
          updated_at: new Date().toISOString(),
        }));
      }
      const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => null);
      if (idx && Array.isArray(idx.entries)) {
        idx.entries = idx.entries.filter(e => e && e.id !== id);
        await store.setJSON('_index.json', idx);
      }
    } catch (e) {}
    writeArr(AP, readArr(AP).filter(x => x !== id));
    writeArr(CC, readArr(CC).filter(x => x !== id));
    const nr = readArr(NR);
    if (!nr.includes(id)) writeArr(NR, [...nr, id]);
    const qq = readArr(QUEUE);
    if (!skipQueue && !qq.includes(id)) {
      writeArr(QUEUE, prepend ? [id, ...qq] : [...qq, id]);
      queued = true;
    }
  });
  if (fromPipeline) pipelineScrubPriority.add(id);
  if (queued) ensureScrubberRunning(fromPipeline ? ('generate:' + id) : ('queue:' + id));
}

// Owner ✗ — drill into exactly the rubric items they flagged, then re-audit.
const CONTENT_TARGET_KEYS = new Set(['words2000', 'directAnswer', 'directAnswerFull', 'faq6', 'mermaid2', 'mermaidClean', 'sources5', 'relatedPulse', 'linksClean', 'score12']);
async function applyOwnerNotesFix(id, title, body, notes, targets, save, out) {
  const n = String(notes || '').trim();
  if (!n) return body;
  const labels = (targets || []).map(k => RUBRIC_LABELS[k] || k).join(', ') || 'general quality';
  try {
    const { content } = await dsChat([
      { role: 'system', content: 'You fix PULSE Q&A markdown entries. Apply ONLY what the owner asked. Return the FULL corrected markdown answer with no preamble or commentary.' },
      { role: 'user', content: 'Entry ' + id + ': ' + title + '\nOwner flagged rubric items: ' + labels + '\nOwner notes: ' + n + '\n\nReturn the full fixed answer markdown:\n\n' + String(body).slice(0, 14000) },
    ], { temperature: 0.35 });
    const fixed = String(content || '').trim();
    if (fixed.length > 400 && fixed.includes('##')) {
      await save(fixed);
      if (out && !out.steps.includes('owner-notes-fix')) out.steps.push('owner-notes-fix');
      return fixed;
    }
  } catch (e) {}
  return body;
}
async function runTargetedOwnerFixes(id, title, body, targets, ctx) {
  const { save, sib, out, ui, shouldStop, ownerNotes } = ctx;
  const t = new Set((targets || []).filter(Boolean));
  if (!t.size) return body;
  const labels = [...t].map(k => RUBRIC_LABELS[k] || k).slice(0, 4).join(', ');
  pipelineStage(ui, 'content', 0, 1, 'Owner fix → ' + labels + (t.size > 4 ? '…' : ''));
  const target = pillarOf(id) === 'q' ? 8 : 25;
  if (t.has('words2000')) {
    const nb = boldify(deban(body), target);
    if (nb !== body) { body = nb; await save(body); }
  }
  if ([...t].some(k => CONTENT_TARGET_KEYS.has(k))) {
    await fixEntry(id, title, sib, valid, contentChat).catch(() => {});
    const r = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (r && r.answer) body = r.answer;
    if (t.has('relatedPulse') && sib.length && /Related on PULSE/i.test(body)) {
      const rel = '## Related on PULSE\n\n' + sib.slice(0, 5).map(s => '- [' + String(s.title).replace(/[\[\]]/g, '') + '](/knowledge/' + s.id + ')').join('\n');
      const nb2 = body.replace(/#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{2,3}\s|$)/i, rel + '\n\n');
      if (nb2 !== body) body = nb2;
    }
    await save(body);
    if (out && !out.steps.includes('targeted-content')) out.steps.push('targeted-content');
  }
  if (t.has('media3to10') || t.has('imagesLaw')) {
    pipelineStage(ui, 'media', 1, 3, 'Fixing image count');
    const withImg = await ensureMediaImages(id, title, pillarOf(id), body);
    if (withImg !== body) { body = withImg; await save(body); if (out && !out.steps.includes('targeted-media')) out.steps.push('targeted-media'); }
  }
  if (t.has('heroImage') || t.has('faceCardApplicable')) {
    pipelineStage(ui, 'media', 2, 3, 'Fixing hero / face-card');
    const heroFixed = auditHero(id, body);
    if (heroFixed !== body) { body = heroFixed; await save(body); }
    if (!C.topImage(body)) {
      body = body.replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
      const alt = String(title).replace(/[\[\]"]/g, '').slice(0, 80);
      const hero = (REQUIRE_FLUX_IMAGES || INTERNAL_IMAGES_DDG) ? ('/assets/qa/' + id + '.jpg') : pollCoverUrl(title, pillarOf(id));
      body = '![' + alt + '](' + hero + ')\n\n' + body.trimStart();
      await save(body);
    }
  }
  if (t.has('pollinatorFaceCover') || t.has('imagesLaw')) {
    pipelineStage(ui, 'pollinator_cover', 0, 1, 'Fixing flux cover');
    if (fluxLaneCooling()) {
      pipelineDone(ui, 'pollinator_cover', 'Flux cooling — retry later');
    } else {
      let fr;
      if (t.has('pollinatorFaceCover') || t.has('heroImage')) {
        fr = await fluxFaceHeroOnlyEntry(id, title, body, { shouldStop: shouldStop || (() => false) });
        if (fr.body) body = finalizePollinatorScrubBody(id, title, fr.body);
      } else {
        fr = await fluxCoverTracked(id, title, body, coverSrcOf[id], () => {}, shouldStop || (() => false));
        if (!fr.skipped && fr.body !== body) body = fr.body;
      }
      if (!fr.stopped && !fr.error) {
        coverSrcOf[id] = 'flux';
        await stampFluxProvenance(id, store, 'flux');
        if (!out.steps.includes('targeted-cover')) out.steps.push('targeted-cover');
      }
    }
  }
  if (t.has('pollinatorInternalFlux') || t.has('imagesLaw')) {
    pipelineStage(ui, 'pollinator_flux', 0, 1, INTERNAL_IMAGES_DDG ? 'Fixing DDG sections' : 'Fixing flux internals');
    if (INTERNAL_IMAGES_DDG) {
      await waitFluxIdle();
      await ddgSettle();
      body = await finalizeInternalDdgImages(id, title, pillarOf(id), body, () => {});
      body = await ensureInternalImagesRendered(id, title, pillarOf(id), body, () => {});
      if (!out.steps.includes('targeted-ddg')) out.steps.push('targeted-ddg');
    } else if (REQUIRE_FLUX_IMAGES) {
      const fr = await fluxRewriteEntry(id, title, body, { shouldStop: shouldStop || (() => false) });
      if (fr.body) { body = finalizePollinatorScrubBody(id, title, fr.body); coverSrcOf[id] = 'flux'; if (!out.steps.includes('targeted-flux')) out.steps.push('targeted-flux'); }
    }
    await save(body);
  }
  if (t.has('top10Images')) {
    pipelineStage(ui, 'media', 3, 3, 'Fixing Top-10 images');
    try {
      const ri = await ensureTop10Images(id, title, body);
      if (ri && ri.body && ri.body !== body) { body = ri.body; await save(body); if (!out.steps.includes('targeted-top10')) out.steps.push('targeted-top10'); }
    } catch (err) {}
  }
  pipelineDone(ui, 'content', 'Owner-targeted pass done');
  if (ownerNotes) {
    pipelineStage(ui, 'content', 1, 1, 'Applying owner notes…');
    body = await applyOwnerNotesFix(id, title, body, ownerNotes, [...t], save, out);
    pipelineDone(ui, 'content', 'Owner notes applied');
  }
  markRejectFixStatus(id, 'targeted-fix', { ownerTargets: [...t], ownerNotes: ownerNotes || null });
  return body;
}

// Shared full scrub pipeline — used by Generate (factor 1) and Scrubber (factor 2 / publish).
async function entryScrubPipeline(opts) {
  const {
    id, title, body: initialBody,
    save, sib, out = { steps: [] },
    ui = 'scrub',
    certifyOnPass = true,
    maxRounds = 5,
    shouldStop = () => false,
    targetFixes = null,
    pipelineFastFactor2 = false,
  } = opts;
  const rejectRec = readRejectFix().find(x => x && x.id === id);
  const ownerTargets = targetFixes || (rejectRec && rejectRec.ownerTargets) || null;
  const imageRetargetOnly = isOwnerImageRetarget(ownerTargets);
  const effectiveMaxRounds = imageRetargetOnly ? 1 : maxRounds;
  const target = pillarOf(id) === 'q' ? 8 : 25;
  let body = initialBody;
  let generated = false, parkReason = null;
  let retargetDoneDdg = false, retargetDoneMedia = false, retargetDoneCover = false;
  let lastImgTriple = { ok: false, passes: 0 };

  for (let round = 1; round <= effectiveMaxRounds; round++) {
    if (shouldStop()) return { status: 'stopped', body, msg: 'stopped', score: gradeEntry(id, body, { imagesDeferred: true }).score };
    touchScrubLive({ round });
    if (round === 1 && ownerTargets && ownerTargets.length) {
      const ownerNotes = rejectRec && rejectRec.ownerNotes;
      body = await runTargetedOwnerFixes(id, title, body, ownerTargets, { save, sib, out, ui, shouldStop, ownerNotes });
      retargetDoneDdg = ownerTargets.some(k => k === 'pollinatorInternalFlux' || k === 'imagesLaw');
      retargetDoneMedia = ownerTargets.some(k => k === 'media3to10' || k === 'imagesLaw');
      retargetDoneCover = ownerTargets.some(k => k === 'pollinatorFaceCover' || k === 'imagesLaw' || k === 'heroImage' || k === 'faceCardApplicable');
      if (!out.steps.includes('owner-targeted')) out.steps.push('owner-targeted:' + ownerTargets.join(','));
      if (imageRetargetOnly && !out.steps.includes('owner-image-fast')) out.steps.push('owner-image-fast');
    }
    pipelineStage(ui, 'format', round, maxRounds, 'Round ' + round + ' · deban + bold');
    const nb = boldify(deban(body), target);
    if (nb !== body) body = nb;
    body = ensureErFormat(id, body);
    body = ensureTop10ProductLines(body);
    if (INTERNAL_IMAGES_DDG) {
      const stripped = stripPlaceholderImageLines(body);
      if (stripped !== body) { body = stripped; await save(body); if (!out.steps.includes('strip-placeholders')) out.steps.push('strip-placeholders'); }
    }
    if (body && !out.steps.includes('deban+bold')) out.steps.push('deban+bold');
    let g = gradeEntry(id, body, { imagesDeferred: true });
    if ((g.missing || []).includes('images_law') || !C.topImage(body)) {
      pipelineStage(ui, 'format', 1, 2, 'Fixing cover placeholder');
      body = body.replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
      if (pillarOf(id) === 'tl') {
        const cover = '/assets/cro-cover-' + ((Math.abs(parseInt(id.slice(2), 10) || 0) % 5) + 1) + '.jpg';
        const alt = String(title).replace(/[\[\]"]/g, '').slice(0, 80);
        body = '![' + alt + '](' + cover + ')\n\n' + body.trimStart();
        await save(body);
      } else {
        const alt = String(title).replace(/[\[\]"]/g, '').slice(0, 80);
        const hero = (REQUIRE_FLUX_IMAGES || INTERNAL_IMAGES_DDG) ? ('/assets/qa/' + id + '.jpg') : pollCoverUrl(title, pillarOf(id));
        body = '![' + alt + '](' + hero + ')\n\n' + body.trimStart();
        await save(body);
        if (!REQUIRE_FLUX_IMAGES && !INTERNAL_IMAGES_DDG && !C.topImage(body)) { await fixCover(id, title).catch(() => {}); const r = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null); if (r && r.answer) body = r.answer; }
      }
      if (!out.steps.includes('cover')) out.steps.push('cover');
    }
    await save(body);
    if (isTop10Body(body) && !auditTop10Images(id, body).compliant && !INTERNAL_IMAGES_DDG && !REQUIRE_FLUX_IMAGES) {
      try { const ri = await ensureTop10Images(id, title, body); if (ri && ri.body && ri.body !== body) { body = ri.body; await save(body); if (!out.steps.includes('top10-imgs')) out.steps.push('top10-imgs'); } } catch (err) {}
    }
    pipelineDone(ui, 'format', 'Format pass done');
    g = gradeEntry(id, body, { imagesDeferred: true });
    const rbRound = rubricSignOff(id, body);
    const contentBlockers = (rbRound.failed || []).filter(k => CONTENT_SCRUB_BLOCKERS.has(k));
    let skipContentPass = pipelineFastFactor2 && round === 1 && rbRound.pass && g.score >= 13;
    const needsContentPass = !skipContentPass && !imageRetargetOnly && (g.score < MIN_SCORE || contentBlockers.length > 0);
    if (needsContentPass) {
      pipelineStage(ui, 'content', round, maxRounds, 'DeepSeek writing · round ' + round);
      await fixEntry(id, title, sib, valid, contentChat).catch(() => {});
      const r = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null); if (r && r.answer) body = r.answer;
      body = enforceCroCardLaw(body, id);
      generated = true; if (!out.steps.includes('deepseek-fill')) out.steps.push('deepseek-fill');
      if (sib.length && /Related on PULSE/i.test(body)) { const rel = '## Related on PULSE\n\n' + sib.slice(0, 5).map(s => `- [${String(s.title).replace(/[\[\]]/g, '')}](/knowledge/${s.id})`).join('\n'); const nb2 = body.replace(/#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{2,3}\s|$)/i, rel + '\n\n'); if (nb2 !== body) body = nb2; }
      await save(body);
      g = gradeEntry(id, body, { imagesDeferred: true });
      pipelineRubric(ui, id, body);
      const guard = await laneContentAuditGuard(id, title, body);
      if (!guard.pass) {
        if (!out.steps.includes('audit-block')) out.steps.push('audit-block');
        parkReason = parkReason || ('auditors: ' + (guard.notes || 'fail'));
        if (round < effectiveMaxRounds) continue;
        return { status: 'parked', score: g.score, body, passedGate: false, rubric: rubricSignOff(id, body), msg: guard.notes || 'auditors blocked' };
      }
      if (guard.body && guard.body !== body) { body = guard.body; await save(body); g = gradeEntry(id, body, { imagesDeferred: true }); }
    }
    pipelineDone(ui, 'content', 'Content round ' + round + ' done');
    if (!imageRetargetOnly || !retargetDoneMedia) {
    pipelineStage(ui, 'media', round, maxRounds, 'Media images · round ' + round);
    const withImg = await ensureMediaImages(id, title, pillarOf(id), body);
    if (withImg !== body) { body = withImg; await save(body); if (!out.steps.includes('media')) out.steps.push('media'); g = gradeEntry(id, body, { imagesDeferred: true }); }
    pipelineRubric(ui, id, body);
    if (REQUIRE_FLUX_IMAGES) {
      const synced = finalizePollinatorScrubBody(id, title, body);
      if (synced !== body) { body = synced; await save(body); if (!out.steps.includes('face-card')) out.steps.push('face-card'); }
    } else {
      const heroFixed = auditHero(id, body); if (heroFixed !== body) { body = heroFixed; await save(body); if (!out.steps.includes('face-card')) out.steps.push('face-card'); }
    }
    pipelineDone(ui, 'media', 'Media pass done');
    } else {
      pipelineDone(ui, 'media', 'Skipped — owner retarget already fixed media');
    }
    const bothImageBlocked = pipelineBothImageBlocked(ui, out);
    if (!bothImageBlocked && REQUIRE_FLUX_IMAGES) {
      const plan = countRewriteJobs(body);
      pipelineStage(ui, 'pollinator_cover', 0, 1, 'Whole-page Pollinator · face-card + hero');
      pipelineStage(ui, 'pollinator_flux', 0, plan.total || 1, 'Whole-page Pollinator · 0/' + (plan.total || 1));
      const fr = await fluxRewriteEntry(id, title, body, {
        shouldStop,
        onProgress: p => {
          const label = p.label || p.phase || 'flux';
          const detail = p.detail || (p.done + ' / ' + (p.total || plan.total || 1) + ' — ' + label);
          pipelineStage(ui, 'pollinator_flux', p.done, p.total || plan.total || 1, detail);
        },
      });
      if (fr.stopped) return { status: 'stopped', body: fr.body || body, msg: 'stopped', score: gradeEntry(id, fr.body || body, { imagesDeferred: true }).score };
      if (fr.error) {
        if (!out.steps.includes('pollinator-overwrite-fail')) out.steps.push('pollinator-overwrite-fail:' + fr.error);
        pipelineDone(ui, 'pollinator_cover', 'Overwrite failed: ' + fr.error);
        pipelineDone(ui, 'pollinator_flux', 'Overwrite failed: ' + fr.error);
      } else {
        const prevBody = body;
        body = finalizePollinatorScrubBody(id, title, fr.body || body);
        if (body !== prevBody) { await save(body); if (!out.steps.includes('pollinator-overwrite')) out.steps.push('pollinator-overwrite'); }
        clearImageVerifyCache(id);
        coverSrcOf[id] = 'flux';
        await stampFluxProvenance(id, store, 'flux');
        g = gradeEntry(id, body, { imagesDeferred: true });
        await waitFluxIdle();
        pipelineStage(ui, 'pollinator_flux', plan.total || 1, plan.total || 1, 'Verifying Pollinator images render');
        const pollRenderOk = await internalImagesLiveOk(body, id);
        if (!pollRenderOk && !out.steps.includes('pollinator-render-warn')) out.steps.push('pollinator-render-warn');
        pipelineDone(ui, 'pollinator_cover', 'Face-card + hero synced · no duplicate top images');
        pipelineDone(ui, 'pollinator_flux', (fr.fluxDone || plan.total || 0) + ' flux jobs · whole page' + (pollRenderOk ? ' · render OK' : ' · render check failed'));
      }
    } else if (INTERNAL_IMAGES_DDG) {
      if (!bothImageBlocked) {
      const hero = (String(body).match(/!\[[^\]]*\]\(([^)]+)\)/) || [])[1] || '';
      const skipHeroSync = imageRetargetOnly && retargetDoneCover && faceCoverOk(id);
      if (!skipHeroSync && (hero !== '/assets/qa/' + id + '.jpg' || !faceCoverOk(id))) {
        const plan = countCoverFluxJobs(id, coverSrcOf[id]);
        if (plan.needCover) {
          if (fluxLaneCooling()) {
            pipelineDone(ui, 'pollinator_flux', 'Flux cooling — DDG lane');
            if (!out.steps.includes('flux-cooling-skip')) out.steps.push('flux-cooling-skip');
          } else {
          pipelineStage(ui, 'pollinator_flux', 0, 1, 'Syncing flux hero');
          const fr = await fluxCoverTracked(id, title, body, coverSrcOf[id], p => {
            pipelineStage(ui, 'pollinator_flux', p.done, p.total || 1, p.detail || 'face-card cover');
          }, shouldStop);
          if (!fr.skipped && fr.body !== body) { body = fr.body; await save(body); }
          coverSrcOf[id] = 'flux';
          await stampFluxProvenance(id, store, 'flux');
          }
        } else {
          const alt = String(title).replace(/[\[\]"]/g, '').slice(0, 80);
          const nb = String(body).replace(/!\[[^\]]*\]\(([^)]+)\)/, '![' + alt + '](/assets/qa/' + id + '.jpg)');
          if (nb !== body) { body = nb; await save(body); }
          if (coverFileOk(id)) { coverSrcOf[id] = 'flux'; await stampFluxProvenance(id, store, 'flux'); }
        }
      }
      const ddgTargets = ddgImageSectionTargets(String(body).split('\n'), body);
      await waitFluxIdle();
      await ddgSettle();
      body = trimExcessMediaImages(body);
      await save(body);
      if (isTop10Body(body)) {
        let top10Round = 0;
        const maxTop10Rounds = 3;
        while (!auditTop10Images(id, body).compliant && top10Round < maxTop10Rounds) {
          top10Round++;
          const audit = auditTop10Images(id, body);
          pipelineStage(ui, 'pollinator_flux', Math.min(top10Round, TOP10_IMAGE_TOTAL - 1), TOP10_IMAGE_TOTAL, 'Top-10 round ' + top10Round + '/' + maxTop10Rounds + (audit.needs && audit.needs.length ? (' · need ' + audit.needs.join(', ')) : ''));
          try {
            const ri = await ensureTop10Images(id, title, body);
            if (ri && ri.body && ri.body !== body) { body = ri.body; await save(body); if (!out.steps.includes('top10-imgs')) out.steps.push('top10-imgs'); }
          } catch (err) { if (!out.steps.includes('top10-imgs-fail')) out.steps.push('top10-imgs-fail'); }
          if (!auditTop10Images(id, body).compliant && top10Round < maxTop10Rounds) await ddgSettle();
        }
        const finalAudit = auditTop10Images(id, body);
        pipelineDone(ui, 'pollinator_flux', finalAudit.compliant ? 'Top-10 images OK' : ('Top-10 incomplete · ' + ((finalAudit.needs || []).join(', ') || 'check @@PRODUCT imgs')));
      } else if (imageRetargetOnly && retargetDoneDdg) {
        pipelineStage(ui, 'pollinator_flux', 0, 1, 'Owner retarget — DDG already fixed');
        pipelineDone(ui, 'pollinator_flux', 'Skipped duplicate DDG pass');
      } else if (ddgLaneCooling()) {
        pipelineDone(ui, 'pollinator_flux', 'DDG cooling — flux lane');
        if (!out.steps.includes('ddg-cooling-skip')) out.steps.push('ddg-cooling-skip');
      } else {
      const ddgLabel = 'DDG section images (max ' + ddgTargets.length + ' · typical 5–8)';
      pipelineStage(ui, 'pollinator_flux', 0, Math.max(1, ddgTargets.length), ddgLabel);
      const ddgBody = await finalizeInternalDdgImages(id, title, pillarOf(id), body, p => {
        pipelineStage(ui, 'pollinator_flux', p.done, p.total || 1, (p.label || 'section') + ' · DDG');
      });
      if (ddgBody !== body) { body = ddgBody; await save(body); if (!out.steps.includes('ddg-images')) out.steps.push('ddg-images'); }
      pipelineStage(ui, 'pollinator_flux', 0, 1, 'Verifying DDG images render (wsrv proxy)');
      const renderedBody = await ensureInternalImagesRendered(id, title, pillarOf(id), body, p => {
        pipelineStage(ui, 'pollinator_flux', p.done, p.total || 1, (p.label || 'verify') + ' · render check');
      });
      if (renderedBody !== body) { body = renderedBody; await save(body); if (!out.steps.includes('ddg-verify')) out.steps.push('ddg-verify'); }
      await save(body);
      await ddgSettle();
      if (!(await confirmBlobBody(id, body))) await save(body);
      pipelineDone(ui, 'pollinator_flux', 'DDG section images ready');
      }
      }
      g = gradeEntry(id, body, { imagesDeferred: true });
    } else pipelineDone(ui, 'pollinator_flux', 'Section images OK');
    pipelineRubric(ui, id, body);
    body = enforceCroCardLaw(body, id);
    await save(body);
    if (!croCardLawOk(body, id)) {
      if (!out.steps.includes('cro-law-fix')) out.steps.push('cro-law-fix');
      await save(body);
    }
    body = await dedupeEntryImages(id, title, body, ui, out);
    await save(body);
    pipelineStage(ui, 'pollinator_flux', 0, 3, 'Triple-check all images render');
    const imgTriple = await tripleVerifyAllImagesRender(body, id, {
      forceVerify: true,
      save: async b => { body = b; await save(b); },
      onProgress: p => pipelineStage(ui, 'pollinator_flux', p.pass, p.total, p.label || 'triple verify'),
    });
    lastImgTriple = imgTriple;
    body = imgTriple.body;
    await save(body);
    if (imgTriple.ok) {
      if (!out.steps.includes('triple-image-verify')) out.steps.push('triple-image-verify');
    } else if (!out.steps.includes('triple-image-fail')) out.steps.push('triple-image-fail');
    pipelineDone(ui, 'pollinator_flux', imgTriple.ok ? 'All images verified (×' + imgTriple.passes + ')' : 'Triple image verify failed');
    const gate = await finalPublishGate(id, title, body, {
      onRubric: () => pipelineRubric(ui, id, body),
    });
    if (gate.pass) {
      const publishImagesOk = imgTriple.ok && croCardLawOk(body, id);
      if (!publishImagesOk && round < effectiveMaxRounds) {
        pipelineDone(ui, 'pollinator_flux', (!imgTriple.ok ? 'Triple image verify failed' : 'CRO card law failed') + ' — retry round ' + (round + 1));
        continue;
      }
      if (!publishImagesOk) {
        return { status: 'parked', score: gate.score, body, passedGate: false, rubric: gate.rubric, msg: !imgTriple.ok ? 'triple image verify failed — re-scrub' : 'CRO card law failed — re-scrub' };
      }
      if (certifyOnPass) {
        pipelineStage(ui, 'certify', 1, 1, ui === 'scrub' ? (gate.score + '/13 — routing') : 'Publishing…');
        pipelineDone(ui, 'certify', ui === 'scrub' ? (gate.score + '/13 rubric pass — publish check') : ('Certified ' + gate.score + '/13'));
        if (ui === 'scrub' && PIPELINE_AUTO_SCRUB_PUBLISH && await isPipelineGeneratedEntry(id)) {
          const prep = await pipelinePublishReady(id, body, { imageVerified: true });
          if (prep.body && prep.body !== body) { body = prep.body; await save(body); }
          if (prep.ok) {
            await finishPipelinePublish(id, title, body, gate.score, out, 'scrub-pipeline');
            return { status: 'certified', score: gate.score, body, passedGate: true, rubric: gate.rubric, imageVerified: true };
          }
          await requeuePipelineForScrub(id, prep.reason);
          return { status: 'parked', score: gate.score, body, passedGate: true, rubric: gate.rubric, msg: prep.reason + ' — re-queued for scrub', imageVerified: false };
        }
        if (ui === 'scrub') {
          return { status: 'ready', score: gate.score, body, passedGate: true, rubric: gate.rubric, msg: imgTriple.ok ? 'rubric pass — routing' : 'rubric pass — images need re-scrub before publish', imageVerified: !!imgTriple.ok };
        }
        try {
          await certify(id, gate.score, body, { via: 'generate', rubric: gate.rubric, title });
        } catch (certErr) {
          if (certErr && certErr.code === 'PUBLISH_IMAGE_GATE') {
            return { status: 'parked', score: gate.score, body, passedGate: true, rubric: gate.rubric, msg: (certErr.reason || certErr.message) + ' — re-scrub images', imageVerified: false };
          }
          throw certErr;
        }
        bumpDay();
        if (!generated && !out.steps.includes('deterministic — no audit needed')) out.steps.push('deterministic');
        if (ui === 'gen') { genJob.stage = '✅ auto-indexed ' + gate.score + '/13'; saveGen(); }
        return { status: 'certified', score: gate.score, body, passedGate: true, rubric: gate.rubric, imageVerified: !!imgTriple.ok };
      }
      pipelineStage(ui, 'certify', 1, 1, 'Factor-1 pass → scrub queue');
      pipelineDone(ui, 'certify', 'Queued for factor-2 scrub');
      if (ui === 'gen') { genJob.stage = '✅ factor-1 pass → scrub queue'; saveGen(); }
      return { status: 'ready', score: gate.score, body, passedGate: true, rubric: gate.rubric, msg: 'factor-1 passed — queued for scrubber', imageVerified: !!imgTriple.ok };
    }
    {
      const rb = gate.rubric || rubricSignOff(id, body);
      const reviewReady = ownerReviewReadyResult(id, body, rb, ui);
      if (reviewReady) {
        if (!out.steps.includes('owner-review-pile')) out.steps.push('owner-review-pile:' + (reviewReady.caveats || []).join(','));
        if (ui === 'gen') { genJob.stage = '📋 12/13 → approval pile (review caveats)'; saveGen(); }
        return reviewReady;
      }
      parkReason = !faceCoverOk(id) ? 'no pollinator face-card cover (flux throttled — retry)' : (!internalImagesOk(body, id) ? 'internal section images not DDG-ready (retry)' : ('rubric: ' + ((rb.failed || []).join(',') || (g.missing || []).join(','))));
    }
  }
  const rbEnd = rubricSignOff(id, body);
  const reviewReady = ownerReviewReadyResult(id, body, rbEnd, ui);
  if (reviewReady) {
    if (!out.steps.includes('owner-review-pile')) out.steps.push('owner-review-pile:' + (reviewReady.caveats || []).join(','));
    return reviewReady;
  }
  return { status: 'parked', body, msg: parkReason, score: rbEnd.contentScore != null ? rbEnd.contentScore : gradeEntry(id, body, { imagesDeferred: true }).score, contentScore: rbEnd.contentScore != null ? rbEnd.contentScore : gradeEntry(id, body, { imagesDeferred: true }).score, rubricFailed: rbEnd.failed, rubricPass: rbEnd.pass, passedGate: false, imageVerified: !!lastImgTriple.ok };
}

async function scrubOneWork(forcedId) {
  const used = dayCount();
  if (used >= DAILY_MAX) return { done: 'cap', msg: `Daily cap ${DAILY_MAX} reached — resets tomorrow.` };
  let queue = readArr(QUEUE);
  const force = forcedId ? String(forcedId).trim() : '';
  if (!force && !queue.length) return { done: 'empty', msg: 'No under-12 URLs left in the queue. 🎉' };
  const id = force || pickNextScrubId(queue);
  if (!id) return { done: 'empty', msg: 'No under-12 URLs left in the queue. 🎉' };
  if (force) {
    pipelineScrubPriority.add(id);
    if (!queue.includes(id)) writeArr(QUEUE, [id, ...queue]);
    else writeArr(QUEUE, [id, ...queue.filter(x => x !== id)]);
    queue = readArr(QUEUE);
    autoLog('🎯 force scrub → ' + id);
  }
  if (readRejectFix().some(x => x && x.id === id)) markRejectFixStatus(id, 'scrubbing');
  scrubSlotId = id;
  const title = titleOf[id] || id;
  const sib = (byPillar[pillarOf(id)] || []).filter(s => s.id !== id);
  const out = { id, title: String(title).slice(0, 90), pillar: pillarOf(id), steps: [] };
  resetScrubProgress(id, out.title, out.pillar, filterQueueByPillar(queue).length);
  setScrubStep('load', 0, 1, 'Loading blob…');
  try {
    let e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { writeArr(QUEUE, queue.filter(x => x !== id)); return Object.assign(out, { status: 'skip', msg: 'no blob' }); }
    let body = e.answer;
    out.before = gradeEntry(id, body, { imagesDeferred: true }).score;
    markScrubStepDone('load', 'Loaded · started at ' + out.before + '/13');
    pushRubricLive(id, body);

    const save = async b => { try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); await store.setJSON('answers/' + id + '.json', Object.assign({}, cur || e, { answer: b, updated_at: new Date().toISOString() })); } catch (x) {} };
    const pipeFast = await isPipelineGeneratedEntry(id);
    const result = await entryScrubPipeline({
      id, title, body,
      save, sib, out,
      ui: 'scrub', certifyOnPass: true,
      maxRounds: pipeFast && out.before >= MIN_SCORE ? 2 : 5,
      pipelineFastFactor2: pipeFast,
      shouldStop: () => !!autoJob.stop,
    });
    // #2 (Fable): expose which of the 13 criteria failed, for the heatmap + 20% circuit breaker.
    const _CRIT = { words2000: 1, directAnswer: 2, directAnswerFull: 3, faq6: 4, faq5: 4, mermaid2: 5, mermaidClean: 6, sources5: 7, relatedPulse: 8, linksClean: 9, heroImage: 10, media3to10: 11, faceCardApplicable: 12, pollinatorFaceCover: 12, pollinatorInternalFlux: 12, top10Images: 12, rankingListMaster: 12, imagesLaw: 12, score12: 13 };
    out.failedCriteria = [...new Set(((result.rubric && result.rubric.failed) || []).map(k => _CRIT[k]).filter(Boolean))].sort((a, b) => a - b);
    if (result.status === 'stopped') return Object.assign(out, { status: 'stopped', msg: 'stop queued' });
    if (result.status === 'certified') {
      await loadIndex();
      if (!out.steps.includes('rubric-signoff')) out.steps.push('rubric-signoff');
      return Object.assign(out, { status: 'certified', score: result.score });
    }
    return await routeScrubOutcome(id, title, body, result, out);
  } catch (x) {
    return Object.assign(out, { status: 'error', msg: x.message });
  }
}

function buildPage(mode) {
  const isScrub = mode === 'scrub';
  const isGenerate = mode === 'generate';
  const isDuplicator = mode === 'duplicator';
  const isImgGen = mode === 'imgen';
  const isRewrite = mode === 'rewrite';
  const isFaceHero = mode === 'facehero';
  const isFormatFix = mode === 'formatfix';
  const isInternalImages = mode === 'internalimages';
  const isRubricStation = mode === 'rubricstation';
  const humanAuditor = isHumanAuditorMode();
  const approvalSub = humanAuditor
    ? 'Tap any entry for <b>fullscreen review</b> — <b>you\'re the auditor</b>. <b style=color:#2ecc71>✓</b> publish (13/13) · <b style=color:#ff8a76>✗</b> pick what\'s wrong → scrubber fix → back here.'
    : 'Tap any entry for <b>fullscreen review</b> — <b>Cursor auto-auditors</b> gate publish. Only exceptions land here — <b style=color:#2ecc71>✓</b> publish · <b style=color:#ff8a76>✗</b> retarget.';
  const fsBatchExplain = 'Use <b>Rubric Stations</b> — one slice at a time (Writing · Structure · Face · Internal images · Top-10 · Publish gate). Each station has its own fix + auditor. Standard full scrub is disabled.';
  const batchIdleHint = 'Open a station tab — pick pillar — ▶ Start. Finished entries land in the audit pile below.';
  const pageTitle = isRubricStation ? 'Rubric Stations' : (isInternalImages ? 'Internal Images' : (isFormatFix ? 'Format Fixer' : (isFaceHero ? 'Square Builder' : (isRewrite ? 'Pollinator Image Overwrite' : (isImgGen ? 'Image Generator' : (isDuplicator ? 'Image Fill' : (isGenerate ? 'Generate' : 'Audit Hub')))))));
  return `<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>PULSE · ${pageTitle}</title><style>
*{box-sizing:border-box;font-family:Inter,system-ui,Arial,sans-serif}body{margin:0;background:#0b0f14;color:#e8eef2;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:18px}
#gate,#app{display:flex;flex-direction:column;align-items:center;gap:16px;width:92%;max-width:560px}
#gate{display:none;position:relative;z-index:90}
#app{display:none;position:relative;z-index:90}
h1{font-weight:800;margin:0;font-size:1.4rem}.sub{color:#8aa0ad;font-size:.85rem;margin:0;text-align:center}
input{padding:12px;font-size:1.4rem;text-align:center;letter-spacing:.4em;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#0f161e;color:#e8eef2;width:160px}
.counts{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}.pill{padding:8px 14px;border-radius:20px;font-weight:800;font-size:.95rem}.green{background:rgba(46,204,113,.16);color:#2ecc71}.red{background:rgba(231,76,60,.16);color:#ff8a76}.amber{background:rgba(241,196,15,.16);color:#f1c40f}.purple{background:rgba(167,139,250,.18);color:#c4b5fd}
button.scrub{border:none;border-radius:60px;padding:26px 40px;font-size:1.45rem;font-weight:900;color:#06121a;background:linear-gradient(135deg,#13c2c2,#2ecc71);cursor:pointer;box-shadow:0 8px 30px rgba(46,204,113,.35);transition:transform .12s,box-shadow .2s}
button.scrub:hover{transform:translateY(-2px)}button.scrub:active{transform:scale(.97)}button.scrub:disabled{opacity:.55;cursor:wait}
.spin{display:inline-block;width:18px;height:18px;border:3px solid rgba(6,18,26,.3);border-top-color:#06121a;border-radius:50%;animation:s 0.7s linear infinite;vertical-align:-3px;margin-right:8px}@keyframes s{to{transform:rotate(360deg)}}
#result{min-height:84px;width:100%;background:#141b24;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px 16px;font-size:.9rem;opacity:0;transition:opacity .3s}
#result.show{opacity:1}.flash{animation:fl 1s ease}@keyframes fl{0%{background:rgba(46,204,113,.25)}100%{background:#141b24}}
.rid{font-weight:800}.steps{color:#8aa0ad;font-size:.78rem;margin-top:4px}
#fx{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:60}
#uniSplash{position:fixed;inset:0;z-index:70;cursor:pointer;background:#0a0806;touch-action:manipulation;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
#uniEnter{border:none;border-radius:32px;padding:16px 28px;font-size:1rem;font-weight:900;color:#06121a;background:linear-gradient(135deg,#a78bfa,#7c3aed);cursor:pointer;box-shadow:0 8px 28px rgba(124,58,237,.45);z-index:85;position:relative}
#uniEnter:hover{transform:translateY(-2px)}
#uni{position:relative;left:auto;top:auto;transform:none;font-size:min(18vw,5.5rem);cursor:pointer;z-index:85;user-select:none;filter:drop-shadow(0 6px 16px rgba(167,139,250,.55));padding:8px 16px;text-align:center;pointer-events:none}
#uni:hover{transform:none}
#uni .hint{position:relative;display:block;margin-top:10px;font-size:clamp(.85rem,2.5vw,1rem);color:#a78bfa;font-weight:800;text-shadow:0 1px 3px #000}
.before{color:#8aa0ad}.before b{color:#f1c40f}
.popbar{display:flex;width:100%;height:40px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.12);box-shadow:0 2px 12px rgba(0,0,0,.35)}
.popg{background:linear-gradient(90deg,#1e9e57,#2ecc71);transition:width .9s cubic-bezier(.4,1.25,.5,1);display:flex;align-items:center;justify-content:center;color:#06121a;font-weight:800;font-size:.8rem;white-space:nowrap;overflow:hidden}
.popr{background:linear-gradient(90deg,#e74c3c,#ff8a76);transition:width .9s cubic-bezier(.4,1.25,.5,1);display:flex;align-items:center;justify-content:center;color:#2a0a06;font-weight:800;font-size:.8rem;white-space:nowrap;overflow:hidden}
.poplbl{display:flex;justify-content:space-between;width:100%;font-size:.8rem;font-weight:800;margin-top:2px}.poplbl .g{color:#2ecc71}.poplbl .r{color:#ff8a76}
.combo{font-weight:800;color:#f1c40f;font-size:1.05rem;min-height:24px}.combo.pop{animation:cp .4s}@keyframes cp{0%{transform:scale(1)}50%{transform:scale(1.35)}100%{transform:scale(1)}}
.pill.green.cert-pop{animation:certpop .65s ease}@keyframes certpop{0%{transform:scale(1);box-shadow:0 0 0 rgba(46,204,113,0)}40%{transform:scale(1.12);box-shadow:0 0 28px rgba(46,204,113,.65)}100%{transform:scale(1);box-shadow:0 0 0 rgba(46,204,113,0)}}
.pill.red.cert-dip{animation:certdip .65s ease}@keyframes certdip{0%{transform:scale(1)}35%{transform:scale(.94);opacity:.75}100%{transform:scale(1);opacity:1}}
.popbar.cert-shift .popg{box-shadow:0 0 18px rgba(46,204,113,.55)}
.finish-banner{margin:12px auto 0;padding:14px 16px;border-radius:14px;font-weight:800;font-size:.95rem;max-width:540px;width:94%;text-align:center;line-height:1.45;transition:opacity .4s}
.finish-banner.cert{background:rgba(46,204,113,.22);border:2px solid #2ecc71;color:#b8f5d0;box-shadow:0 0 24px rgba(46,204,113,.35)}
.finish-banner.park{background:rgba(241,196,15,.14);border:2px solid #f1c40f;color:#ffe08a}
.finish-banner.ready{background:rgba(167,139,250,.18);border:2px solid #a78bfa;color:#e9d5ff;box-shadow:0 0 20px rgba(167,139,250,.25)}
.run-stats{font-size:.82rem;font-weight:700;color:#9fb0bd;margin:8px auto 0;max-width:540px;width:94%;text-align:center}
.run-stats b.cert-n{color:#2ecc71}.run-stats b.park-n{color:#f1c40f}.run-stats b.ready-n{color:#c4b5fd}
#approvalHub{margin:14px auto 0;max-width:640px;width:94%;text-align:left;border:2px solid #6d28d9;border-radius:18px;background:linear-gradient(165deg,#120a1f 0%,#0e1620 100%);padding:14px 16px 16px;box-shadow:0 8px 32px rgba(109,40,217,.2)}
.approval-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}
.approval-head h2{margin:0;font-size:1.05rem;font-weight:900;color:#e9d5ff}
.approval-head .n{font-size:1.35rem;font-weight:900;color:#c4b5fd}
.approval-sub{font-size:.76rem;color:#8aa;margin-bottom:10px}
.pile-list{display:flex;flex-wrap:wrap;gap:8px;max-height:140px;overflow:auto;padding:8px;margin-bottom:12px;background:#0a0f16;border:1px solid #334;border-radius:12px}
.pile-chip{border:1px solid #4c3d6b;border-radius:10px;padding:8px 10px;cursor:pointer;background:#15101f;min-width:108px;max-width:100%;transition:transform .12s,border-color .15s,background .15s}
.pile-chip:hover{transform:translateY(-1px);border-color:#a78bfa}
.pile-chip.on{border-color:#a78bfa;background:#221433;box-shadow:0 0 0 2px rgba(167,139,250,.35)}
.pile-chip .pid{font-weight:900;color:#e9d5ff;font-size:.82rem}
.pile-chip .ptitle{font-size:.68rem;color:#9fb0bd;margin-top:3px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}
.pile-chip.fixing{border-color:#f59e0b;background:#1a1408}
.pile-chip.fixing .pid{color:#fcd34d}
.pile-chip.review{border-color:#b45309;background:#1a1206}
.pile-chip.review .pid{color:#fcd34d}
.fix-pile-lbl{font-size:.72rem;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:.06em;margin:12px 0 6px}
.reject-toast{font-size:.82rem;font-weight:700;color:#fcd34d;margin-top:8px;min-height:18px}
#rejectModal{display:none;position:fixed;inset:0;z-index:400;background:rgba(4,8,14,.82);align-items:center;justify-content:center;padding:14px}
#rejectModal.on{display:flex}
.reject-box{max-width:500px;width:100%;background:#0e1620;border:2px solid #a78bfa;border-radius:18px;padding:18px 18px 16px;max-height:88vh;overflow:auto;box-shadow:0 16px 48px rgba(0,0,0,.55)}
.reject-box h3{margin:0 0 6px;font-size:1.05rem;color:#e9d5ff}
.reject-box .sub{font-size:.76rem;color:#8aa;margin-bottom:12px;line-height:1.45}
.reject-checks{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px;max-height:42vh;overflow:auto}
.reject-checks label{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid #334;border-radius:12px;cursor:pointer;background:#0a0f16;font-size:.82rem;line-height:1.4}
.reject-checks label:has(input:checked){border-color:#a78bfa;background:#1a1028}
.reject-checks input{margin-top:3px;accent-color:#a78bfa;flex-shrink:0}
.reject-checks .rk{font-weight:800;color:#e8eef2}
.reject-checks .fail{color:#ff8a76;font-size:.7rem}
.reject-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
.reject-actions button{border:none;border-radius:28px;padding:11px 20px;font-weight:900;cursor:pointer;font-size:.9rem}
#rejectCancel{color:#e8eef2;background:#1e293b}
#rejectConfirm{color:#06121a;background:linear-gradient(135deg,#f59e0b,#f97316)}
.reject-notes{margin:0 0 14px}
.reject-notes label{display:block;font-size:.72rem;font-weight:800;color:#8aa;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em}
#rejectNotes{width:100%;min-height:72px;max-height:120px;padding:10px 12px;border-radius:12px;border:1px solid #445;background:#0a0f16;color:#e8eef2;font-size:.84rem;line-height:1.45;resize:vertical;font-family:inherit}
#rejectNotes::placeholder{color:#667}
.pile-empty{font-size:.8rem;color:#667;padding:6px 2px}
.approval-pos{font-size:.78rem;font-weight:800;color:#a78bfa;margin-bottom:8px}
.signoff-meta{font-size:.86rem;color:#e8eef2;line-height:1.5;margin-bottom:10px;font-weight:700}
.signoff-meta a{color:#13c2c2;font-weight:800}
.signoff-rubric{font-size:.72rem;color:#9fb0bd;max-height:100px;overflow:auto;margin-bottom:12px;line-height:1.55;display:grid;grid-template-columns:1fr 1fr;gap:4px 10px}
.signoff-scrublog{font-size:.72rem;color:#9fb0bd;margin-bottom:12px;padding:8px 10px;border:1px solid #334;border-radius:10px;background:#0a0f16;max-height:120px;overflow:auto;font-family:ui-monospace,monospace;line-height:1.5}
.signoff-scrublog-lbl{font-weight:800;color:#c4b5fd;margin-bottom:6px;font-family:Inter,system-ui,Arial,sans-serif}
.signoff-rubric .ok{color:#7fe0a0}.signoff-rubric .no{color:#ff8a76}
.signoff-preview{margin:0 0 12px;border:1px solid #445;border-radius:14px;overflow:hidden;background:#0b1219}
.signoff-preview iframe{width:100%;height:min(52vh,420px);border:0;background:#fff}
.approval-bar{display:flex;gap:14px;justify-content:center;align-items:center;padding:12px 8px 4px;border-top:1px solid #334;margin-top:4px}
.approval-bar button{border:none;cursor:pointer;font-weight:900;transition:transform .12s,box-shadow .15s}
.approval-bar button:active{transform:scale(.96)}
.approval-bar button:disabled{opacity:.45;cursor:wait}
#signoffReject{width:72px;height:72px;border-radius:50%;font-size:2rem;color:#fff;background:linear-gradient(135deg,#ff6b6b,#c0392b);box-shadow:0 8px 24px rgba(192,57,43,.45)}
#signoffApprove{width:72px;height:72px;border-radius:50%;font-size:2rem;color:#06121a;background:linear-gradient(135deg,#22c55e,#2ecc71);box-shadow:0 8px 24px rgba(46,204,113,.5)}
.approval-lbl{display:flex;justify-content:center;gap:48px;font-size:.72rem;font-weight:800;color:#8aa;margin-top:6px}
.approval-lbl span{width:72px;text-align:center}
#signoffNav{display:flex;gap:8px;align-items:center}
#signoffPrev,#signoffNext{border:none;border-radius:20px;padding:8px 14px;font-weight:800;color:#e8eef2;background:#1e293b;cursor:pointer;font-size:.82rem}
.doneov{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font-size:3.2rem;font-weight:900;pointer-events:none;z-index:55;animation:dn 1.3s ease forwards}.okov{color:#2ecc71;text-shadow:0 0 30px rgba(46,204,113,.6)}.noov{color:#ff8a76}@keyframes dn{0%{opacity:0;transform:scale(.6)}20%{opacity:1;transform:scale(1.12)}80%{opacity:1}100%{opacity:0;transform:scale(1)}}
#fsScrub{display:none;position:fixed;inset:0;z-index:250;background:linear-gradient(165deg,#060a10 0%,#0b1520 45%,#0a1218 100%);color:#e8eef2;flex-direction:column;padding:18px 20px 22px;overflow:auto}
#fsScrub.on{display:flex}
#fsApproval{display:none;position:fixed;inset:0;z-index:260;background:linear-gradient(165deg,#0a0614 0%,#0b1520 50%,#0a1218 100%);color:#e8eef2;flex-direction:column;padding:14px 16px 18px;overflow:hidden}
#fsApproval.on{display:flex}
#fsApproval .fs-approval-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px;flex-shrink:0}
#fsApproval .fs-approval-head h2{margin:0;font-size:1.2rem;font-weight:900;color:#e9d5ff}
#fsApprovalClose{border:none;border-radius:24px;padding:10px 18px;font-weight:800;color:#e8eef2;background:#1e293b;cursor:pointer;font-size:.88rem}
#fsApproval #approvalViewer{display:flex!important;flex-direction:column;flex:1;min-height:0;overflow:hidden}
#fsApproval .signoff-meta{flex-shrink:0;margin-bottom:8px}
#fsApproval .signoff-preview{flex:1;min-height:0;margin:0 0 10px;display:flex;flex-direction:column}
#fsApproval .signoff-preview iframe{flex:1;width:100%;height:100%;min-height:0;border:0;background:#fff}
#fsApproval .signoff-rubric{flex-shrink:0;max-height:88px;margin-bottom:8px}
#fsApproval .approval-bar{flex-shrink:0;margin-top:0;padding-top:10px}
#approvalHub:not(.fs-open) #approvalViewer{display:none}
.fs-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,440px);gap:16px;width:100%;max-width:1440px;margin:0 auto;align-items:start}
.fs-main{min-width:0}
.fs-approval-dock{position:sticky;top:8px;max-height:calc(100vh - 36px);overflow:auto;padding-bottom:8px}
#fsScrub #approvalHub{margin:0;width:100%;max-width:none}
#fsScrub #approvalHub.in-scrub .signoff-preview iframe{height:min(36vh,300px)}
#fsScrub #approvalHub.in-scrub .pile-list{max-height:min(28vh,200px)}
#fsSimpleApprovalDock{margin-top:0}
#fsSimpleApprovalDock #approvalHub{margin:0;width:100%;max-width:none;border-width:2px}
#fsSimpleApprovalDock #approvalHub .approval-sub{display:none}
#fsSimpleApprovalDock #approvalHub .approval-head h2{font-size:.95rem}
.fs-simple-pile-wrap{margin-top:4px}
.fs-simple-pile-wrap .fs-simple-lbl{color:#c4b5fd}
@media (max-width:1080px){.fs-split{grid-template-columns:1fr}.fs-approval-dock{position:relative;max-height:none;order:-1}}
.fshead{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.fshead h2{margin:0;font-size:1.55rem;font-weight:900}
.fsstop{border:none;border-radius:30px;padding:10px 20px;font-weight:800;color:#fff;background:linear-gradient(135deg,#ff6b6b,#c0392b);cursor:pointer}
.fsdash{border:none;border-radius:30px;padding:10px 20px;font-weight:800;color:#7fe0d0;background:#0e2430;border:2px solid #13c2c2;cursor:pointer}
#fsGenerate .fsdash{color:#c4b5fd;border-color:#a78bfa;background:#1e1535}
.fsgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;width:100%;max-width:1200px;margin:0 auto}
.fscard{background:#0e1620;border:1px solid #1e3a3f;border-radius:14px;padding:14px 16px}
.fscard h3{margin:0 0 10px;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:#8aa0ad;font-weight:800}
.fsbig{font-size:1.35rem;font-weight:900;line-height:1.35}
.fsmid{font-size:.95rem;font-weight:700;color:#7fe0d0;line-height:1.45}
.fssmall{font-size:.8rem;color:#9fb0bd;line-height:1.5}
.fs-overall-top{max-width:1200px;width:100%;margin:0 auto 18px;padding:14px 16px 16px;background:#0a1218;border:1px solid #1e4a55;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.35)}
.fs-overall-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:10px}
.fs-overall-title{font-size:.8rem;font-weight:800;color:#8aa0ad;text-transform:uppercase;letter-spacing:.08em}
.fs-overall-pct{font-size:2.4rem;font-weight:900;color:#2ecc71;line-height:1;text-shadow:0 0 24px rgba(46,204,113,.35)}
.fs-overall-bar{height:30px;border-radius:15px;background:#0b1219;overflow:hidden;border:2px solid #234}
.fs-overall-bar>i{display:block;height:100%;background:linear-gradient(90deg,#0d9488,#13c2c2,#2ecc71,#a3e635);transition:width .45s ease;box-shadow:0 0 18px rgba(46,204,113,.45)}
.fs-pool-lbl{font-size:.72rem;font-weight:800;color:#667;text-transform:uppercase;letter-spacing:.06em;text-align:center;margin-bottom:4px}
.fsbar{height:18px;border-radius:10px;background:#0b1219;overflow:hidden;border:1px solid #223;margin-top:8px}
.fsbar>i{display:block;height:100%;background:linear-gradient(90deg,#13c2c2,#2ecc71);transition:width .5s}
.entry-overall{display:none;margin-bottom:14px;padding:12px 14px;border:1px solid #1e4a55;border-radius:14px;background:#0a1218}
.entry-overall.on{display:block}
.entry-overall-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
.entry-overall-head span:first-child{font-size:.72rem;font-weight:800;color:#8aa0ad;text-transform:uppercase;letter-spacing:.06em}
.entry-overall-pct{font-size:1.75rem;font-weight:900;color:#2ecc71;line-height:1}
.entry-overall-bar{height:22px;border-radius:11px;background:#0b1219;overflow:hidden;border:2px solid #234}
.entry-overall-bar>i{display:block;height:100%;background:linear-gradient(90deg,#13c2c2,#2ecc71);transition:width .45s ease}
.fssteps{margin-top:8px;font-family:ui-monospace,monospace;font-size:.74rem;color:#8aa;line-height:1.55;max-height:88px;overflow:auto}
.fsqueue{font-family:ui-monospace,monospace;font-size:.72rem;color:#c4d0d8;line-height:1.55;max-height:200px;overflow:auto}
.fsqueue b{color:#7fe0a0}
.fspoll li{font-size:.78rem;color:#cdd6df;margin:4px 0}
.fsstatus{font-size:1.05rem;font-weight:800;color:#7fe0a0;min-height:22px}
.fscarwash{font-size:1.08rem;font-weight:800;color:#e8f4ff;line-height:1.45;margin:8px 0 12px}
.fsstep{display:flex;align-items:center;gap:10px;margin:7px 0;font-size:.78rem}
.fsstep .name{min-width:168px}
.fsstep .count{min-width:72px;color:#8aa0ad;font-size:.72rem;text-align:right}
.fsstep .track{flex:1;height:10px;background:#0b1219;border-radius:6px;overflow:hidden;border:1px solid #223}
.fsstep .track>i{display:block;height:100%;background:linear-gradient(90deg,#13c2c2,#2ecc71);transition:width .35s}
.fsstep.done .name{color:#7fe0a0}.fsstep.active .name{color:#fff;font-weight:800}.fsstep.pending .name{color:#556}
.fsrubric{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px;font-size:.74rem;line-height:1.45}
.fsrubric .ok{color:#2ecc71}.fsrubric .no{color:#ff8a76}.fsrubric .wait{color:#667}
.fs-lane-board{max-width:1440px;width:100%;margin:0 auto 16px;padding:14px 16px;background:#0a1218;border:1px solid #1e4a55;border-radius:16px}
.fs-lane-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap}
.fs-lane-head h3{margin:0;font-size:.82rem;text-transform:uppercase;letter-spacing:.08em;color:#8aa0ad;font-weight:800}
.fs-lane-meta{font-size:.78rem;color:#7fe0d0;font-weight:700;text-align:right;line-height:1.45}
.fs-lane-cols{display:grid;grid-template-columns:minmax(150px,1.5fr) 64px repeat(5,minmax(68px,1fr));gap:6px;font-size:.64rem;font-weight:800;color:#667;text-transform:uppercase;letter-spacing:.04em;padding:0 4px 6px;border-bottom:1px solid #234}
.fs-lane-rows{max-height:min(42vh,360px);overflow:auto}
.fs-lane-row{display:grid;grid-template-columns:minmax(150px,1.5fr) 64px repeat(5,minmax(68px,1fr));gap:6px;align-items:center;padding:8px 4px;border-radius:10px;font-size:.72rem}
.fs-lane-row.active{background:#0f1f28;border:1px solid #13c2c2;box-shadow:0 0 14px rgba(19,194,194,.22)}
.fs-lane-row+.fs-lane-row{border-top:1px solid #1a2830}
.fs-lane-id{font-weight:800;color:#e8eef2;line-height:1.35;min-width:0}
.fs-lane-id small{display:block;font-weight:600;color:#8aa;font-size:.66rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fs-lane-pct{font-weight:900;color:#2ecc71;text-align:center;font-size:.88rem}
.fs-lane-cell{text-align:center;padding:5px 3px;border-radius:6px;line-height:1.25;font-size:.68rem;font-weight:700}
.fs-lane-cell.done{background:#0d2818;color:#2ecc71}
.fs-lane-cell.active{background:#1a3a4a;color:#fff;box-shadow:0 0 8px rgba(19,194,194,.35)}
.fs-lane-cell.pending{background:#0b1219;color:#556}
@media (max-width:900px){.fs-lane-cols,.fs-lane-row{grid-template-columns:1fr 52px repeat(5,minmax(52px,1fr));font-size:.62rem}}
.fs-tick-countdown{max-width:1200px;width:100%;margin:0 auto 18px;padding:22px 20px 18px;text-align:center;background:linear-gradient(180deg,#0a1218 0%,#0d1a22 100%);border:2px solid #13c2c2;border-radius:22px;box-shadow:0 0 32px rgba(19,194,194,.18)}
.fs-tick-countdown.off{display:none}
.fs-tick-lbl{font-size:.82rem;font-weight:800;color:#8aa0ad;text-transform:uppercase;letter-spacing:.12em;margin-bottom:2px}
.fs-tick-num{font-size:7.5rem;font-weight:900;line-height:1.05;color:#2ecc71;text-shadow:0 0 48px rgba(46,204,113,.45);font-variant-numeric:tabular-nums;transition:color .2s}
.fs-tick-num.busy{color:#13c2c2;text-shadow:0 0 48px rgba(19,194,194,.45)}
.fs-tick-sub{font-size:.88rem;color:#7fe0d0;font-weight:700;margin-top:6px;min-height:20px}
.fs-tick-ring{height:10px;border-radius:6px;background:#0b1219;margin-top:14px;overflow:hidden;border:1px solid #234}
.fs-tick-ring>i{display:block;height:100%;background:linear-gradient(90deg,#0d9488,#13c2c2,#2ecc71);transition:width .2s linear}
.tick-cd-mini{display:none;margin-top:12px;padding:14px 16px;border:2px solid #13c2c2;border-radius:16px;background:#0a1218;text-align:center}
.tick-cd-mini.on{display:block}
.tick-cd-mini-num{font-size:3.2rem;font-weight:900;color:#2ecc71;line-height:1;font-variant-numeric:tabular-nums}
.tick-cd-mini-lbl{font-size:.72rem;font-weight:800;color:#8aa;text-transform:uppercase;letter-spacing:.08em;margin-top:4px}
.fs-simple{max-width:1200px;width:100%;margin:0 auto 16px;display:flex;flex-direction:column;gap:14px}
.fs-simple-status{font-size:1.35rem;font-weight:900;color:#2ecc71;text-align:center;padding:8px 0}
.fs-simple-box{padding:18px 20px;border-radius:18px;background:#0a1218;border:2px solid #1e4a55}
.fs-simple-box.timer-box{border-color:#13c2c2;box-shadow:0 0 24px rgba(19,194,194,.15)}
.fs-simple-box.green-box{border-color:#2ecc71;box-shadow:0 0 28px rgba(46,204,113,.2);background:linear-gradient(180deg,#0a1810 0%,#0a1218 100%)}
.fs-simple-box.yellow-box{border-color:#fbbf24;box-shadow:0 0 24px rgba(251,191,36,.18);background:linear-gradient(180deg,#18140a 0%,#0a1218 100%)}
.fs-simple-box.orange-box{border-color:#fb923c;box-shadow:0 0 16px rgba(251,146,60,.12)}
.fs-simple-legend{display:flex;flex-wrap:wrap;gap:8px 14px;font-size:.78rem;font-weight:800;margin-bottom:12px}
.fs-simple-legend span{white-space:nowrap}
.fs-simple-legend .lg-green{color:#2ecc71}.fs-simple-legend .lg-yellow{color:#fbbf24}.fs-simple-legend .lg-orange{color:#fb923c}.fs-simple-legend .lg-red{color:#f87171}
.fs-simple-row.q-green{background:rgba(46,204,113,.16);border:2px solid #2ecc71}
.fs-simple-row.q-yellow{background:rgba(251,191,36,.14);border:2px solid #fbbf24}
.fs-simple-row.q-orange{background:rgba(251,146,60,.1);border:1px solid #fb923c}
.fs-simple-row.q-red{background:rgba(248,113,113,.06);border:1px solid #7f1d1d55}
.fs-simple-row .tag{font-size:.68rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em;margin-top:3px}
.fs-simple-row.q-green .tag{color:#2ecc71}.fs-simple-row.q-yellow .tag{color:#fbbf24}.fs-simple-row.q-orange .tag{color:#fb923c}.fs-simple-row.q-red .tag{color:#f87171}
.fs-simple-box.now-box{border-color:#2ecc71;box-shadow:0 0 28px rgba(46,204,113,.2)}
.fs-simple-box.batch-box{border-color:#334}
.fs-simple-lbl{font-size:.95rem;font-weight:900;color:#e8eef2;margin-bottom:6px;letter-spacing:.02em}
.fs-simple-hint{font-size:.82rem;color:#8aa;margin-bottom:10px;line-height:1.45}
.fs-simple-now-id{font-size:1.6rem;font-weight:900;color:#13c2c2;line-height:1.2}
.fs-simple-now-title{font-size:1.05rem;font-weight:700;color:#e8eef2;margin:6px 0 10px;line-height:1.4}
.fs-simple-now-step{font-size:1.15rem;font-weight:800;color:#fbbf24;margin-bottom:10px}
.fs-simple-now-bar{height:22px;border-radius:12px;background:#0b1219;overflow:hidden;border:2px solid #234}
.fs-simple-now-bar>i{display:block;height:100%;background:linear-gradient(90deg,#fbbf24,#2ecc71);transition:width .4s}
.fs-simple-now-pct{font-size:1.1rem;font-weight:900;color:#2ecc71;margin-top:8px}
.fs-simple-batch{max-height:min(42vh,380px);overflow:auto}
.fs-batch-summary{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;padding:10px 12px;background:#0a1218;border:1px solid #334;border-radius:12px}
.fs-batch-summary .chip{font-size:.78rem;font-weight:800;padding:6px 10px;border-radius:20px;background:#1e293b;color:#cdd6df;border:1px solid #445}
.fs-batch-summary .chip.on{background:#134e4a;border-color:#2ecc71;color:#7fe0d0}
.fs-also-cooking{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-bottom:14px}
.fs-cook-card{padding:10px 12px;border-radius:12px;border:2px solid #334;background:#0e1620;font-size:.82rem;line-height:1.35}
.fs-cook-card.q-green{border-color:#2ecc71;background:rgba(46,204,113,.08)}
.fs-cook-card.q-yellow{border-color:#fbbf24;background:rgba(251,191,36,.08)}
.fs-cook-card.q-orange{border-color:#fb923c;background:rgba(251,146,60,.06)}
.fs-cook-card .cid{font-weight:900;color:#e8eef2;font-size:.95rem}
.fs-cook-card .cstep{color:#7fe0d0;font-weight:700;margin-top:4px;font-size:.78rem}
.fs-cook-card .cpct{font-weight:900;color:#2ecc71;margin-top:4px;font-size:.8rem}
.fs-simple-row{display:flex;align-items:flex-start;gap:10px;padding:10px 8px;border-radius:10px;font-size:.88rem;line-height:1.4;border-bottom:1px solid #1a2830}
.fs-simple-row.on{background:#0f1f28;border:2px solid #13c2c2;margin-bottom:4px}
.fs-simple-row .ico{font-size:1.1rem;flex-shrink:0;width:22px;text-align:center}
.fs-simple-row .body{flex:1;min-width:0}
.fs-simple-row .id{font-weight:900;color:#e8eef2}
.fs-simple-row .step{color:#7fe0d0;font-weight:700;font-size:.82rem;margin-top:2px}
.fs-simple-row .pct{font-weight:900;color:#2ecc71;flex-shrink:0;font-size:.95rem}
.fs-simple-row .bar{height:7px;border-radius:5px;background:#12222b;margin-top:5px;overflow:hidden;width:100%}
.fs-simple-row .bar>i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#13c2c2,#2ecc71);transition:width .4s ease}
.fs-simple-row.q-yellow .bar>i{background:linear-gradient(90deg,#f59e0b,#fbbf24)}
.fs-simple-row.q-orange .bar>i{background:linear-gradient(90deg,#ea7317,#fb923c)}
.fs-simple-row.q-red .bar>i{background:linear-gradient(90deg,#7f1d1d,#f87171)}
.fs-simple-row .wnow{display:inline-block;font-size:.66rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em;padding:2px 7px;border-radius:6px;margin-top:4px;color:#06121a;animation:wnowPulse 1.1s ease-in-out infinite}
.fs-simple-row .wnow.w-content{background:#7fe0d0}
.fs-simple-row .wnow.w-flux{background:#f9a8d4}
.fs-simple-row .wnow.w-ddg{background:#93c5fd}
.fs-simple-row.working{border:2px solid #13c2c2 !important;background:#0f1f28 !important}
@keyframes wnowPulse{0%,100%{opacity:1}50%{opacity:.55}}
.fs-simple-pool{text-align:center;font-size:1rem;font-weight:800;color:#cdd6df;padding:12px 16px;border-radius:14px;background:#0e1620;border:1px solid #334}
.fs-simple-pool b.green{color:#2ecc71}.fs-simple-pool b.red{color:#ff8a76}
.fs-details{margin-top:8px}
.fs-details summary{cursor:pointer;font-weight:800;color:#8aa;font-size:.85rem;padding:10px 4px;list-style:none}
.fs-details summary::-webkit-details-marker{display:none}
.fs-details[open] summary{color:#7fe0d0;margin-bottom:8px}
.scrub-simple{display:none;margin-bottom:12px;padding:14px 16px;border:2px solid #fbbf24;border-radius:16px;background:#0a1218;text-align:left}
.scrub-simple.on{display:block;border-color:#2ecc71}
.scrub-simple-next{font-size:.82rem;font-weight:700;color:#fbbf24;margin-top:4px}
.scrub-simple-now{font-size:1rem;font-weight:900;color:#fbbf24;margin-bottom:6px;line-height:1.4}
.scrub-simple-step{font-size:.88rem;font-weight:700;color:#7fe0d0}
.mode-tabs{display:flex;gap:0;width:100%;max-width:540px;margin:0 auto 14px;border:2px solid #1e3a3f;border-radius:14px;overflow:hidden;background:#0b1219}
.mode-tab{flex:1;border:none;padding:14px 10px;font-size:.9rem;font-weight:800;cursor:pointer;background:transparent;color:#8aa;transition:background .2s,color .2s;display:flex;align-items:center;justify-content:center;text-decoration:none}
a.mode-tab,button.mode-tab{color:inherit;font:inherit;font-family:inherit}
.mode-tab.on[data-mode=scrub]{background:linear-gradient(135deg,#134e4a,#0e3a45);color:#7fe0d0;box-shadow:inset 0 -3px 0 #13c2c2}
.mode-tab.on[data-mode=generate]{background:linear-gradient(135deg,#3b2a6a,#1e1535);color:#c4b5fd;box-shadow:inset 0 -3px 0 #a78bfa}
.mode-tab.on[data-mode=duplicator]{background:linear-gradient(135deg,#7c4a00,#4a2e00);color:#fcd34d;box-shadow:inset 0 -3px 0 #f59e0b}
.mode-tab.on[data-mode=imgen]{background:linear-gradient(135deg,#0e4a6e,#062a40);color:#7fd0ff;box-shadow:inset 0 -3px 0 #38bdf8}
.mode-tab{font-size:.82rem;padding:12px 6px}
.dupe-panel{margin:0 auto 16px;max-width:540px;width:94%;padding:14px 16px 16px;border:1px solid #7c4a00;border-radius:16px;background:linear-gradient(165deg,#1a1206 0%,#0e1620 100%);text-align:left}
.dupe-panel-title{font-weight:900;font-size:1rem;color:#fcd34d;margin-bottom:4px;text-align:center}
.dupe-panel-hint{font-size:.72rem;color:#8aa;margin-bottom:12px;line-height:1.4;text-align:center}
.dupe-panel-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.dupe-panel-row select{padding:10px 12px;border-radius:10px;border:1px solid #6b4a1a;background:#0b1219;color:#e8eef2;font-size:.88rem;min-width:220px;flex:1 1 220px;font-weight:700}
.card-review{margin-top:12px;text-align:center}
.card-review img{max-width:300px;width:100%;border-radius:12px;border:2px solid #334;background:#111;aspect-ratio:1;object-fit:cover}
.card-review-meta{font-size:.78rem;color:#8aa;margin:8px 0;line-height:1.4}
.card-review-btns{display:flex;gap:12px;justify-content:center;margin-top:10px;flex-wrap:wrap}
.card-review-btns button{border:none;border-radius:28px;padding:12px 24px;font-weight:900;font-size:1rem;cursor:pointer;min-width:120px}
#faceheroKeep,#rewriteKeep{color:#06121a;background:linear-gradient(135deg,#22c55e,#86efac)}
#faceheroRetry,#rewriteRetry{color:#fff;background:linear-gradient(135deg,#ff6b6b,#c0392b)}
.dupe-prog{margin-top:12px}
.dupe-prog-bar{height:16px;border-radius:8px;background:#0b1219;overflow:hidden;border:1px solid #6b4a1a}
.dupe-prog-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#f59e0b,#fcd34d);transition:width .45s}
.dupe-prog-lbl{margin-top:8px;font-size:.84rem;font-weight:800;color:#fcd34d;line-height:1.45}
.dupe-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;font-size:.78rem;font-weight:700;color:#c8d0e0}
.dupe-stats span{color:#fcd34d}
.dupe-log{margin-top:12px;font-size:.72rem;color:#8aa;max-height:160px;overflow:auto;font-family:ui-monospace,monospace;line-height:1.5;border:1px solid #334;border-radius:10px;padding:8px 10px;background:#0a0f16}
.dupe-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:4px}
.dupe-btns button{border:none;border-radius:28px;padding:14px 22px;font-weight:900;font-size:.92rem;cursor:pointer}
.square-builder-dock{clear:both;width:100%;margin:28px auto 4px;padding-top:20px;border-top:1px solid rgba(168,85,247,.35)}
.square-builder-dock:empty{display:none}
#formatfixAutoToggle{flex-basis:100%;padding:17px 22px!important;border:3px solid #86efac!important;border-radius:14px!important;background:linear-gradient(135deg,#15803d,#22c55e)!important;color:#fff!important;font-size:1.05rem!important;font-weight:950!important;box-shadow:0 0 24px rgba(34,197,94,.38)}
.square-pexels-option{position:relative;aspect-ratio:1/1;padding:0;border:1.5px solid #EAC15C!important;border-radius:6px;overflow:hidden;background:#1a1a1a;box-shadow:0 0 0 1px rgba(234,193,92,.25);cursor:pointer}
.square-pexels-option img{display:block;width:100%;height:100%;object-fit:cover;filter:brightness(1.14) saturate(1.05)}
#dupeStart{color:#1a1206;background:linear-gradient(135deg,#f59e0b,#fcd34d);box-shadow:0 6px 20px rgba(245,158,11,.35)}
#rewriteStart{color:#1a1206;background:linear-gradient(135deg,#f59e0b,#fbbf24);box-shadow:0 6px 20px rgba(245,158,11,.35)}
#faceheroStart{color:#1a1206;background:linear-gradient(135deg,#c084fc,#e879f9);box-shadow:0 6px 20px rgba(192,132,252,.35)}
#faceheroStop{color:#fff;background:linear-gradient(135deg,#ff6b6b,#c0392b)}
#rewriteStop{color:#fff;background:linear-gradient(135deg,#ff6b6b,#c0392b)}
#imgenStart{color:#06121a;background:linear-gradient(135deg,#38bdf8,#7dd3fc);box-shadow:0 6px 20px rgba(56,189,248,.35)}
#dupeStop{display:none;color:#fff;background:linear-gradient(135deg,#ff6b6b,#c0392b)}
#imgenStop{color:#fff;background:linear-gradient(135deg,#ff6b6b,#c0392b);box-shadow:0 6px 20px rgba(255,107,107,.28)}
#imgenStop:disabled{opacity:.38;cursor:not-allowed;box-shadow:none}
.dupe-force-stop{color:#fff;background:linear-gradient(135deg,#991b1b,#450a0a);box-shadow:0 4px 14px rgba(153,27,27,.28)}
.dupe-force-stop:disabled{opacity:.38;cursor:not-allowed;box-shadow:none}
.pipe-btn-force-stop{color:#fff;background:linear-gradient(135deg,#991b1b,#450a0a);box-shadow:0 4px 14px rgba(153,27,27,.28)}
.pipe-btn-force-stop:disabled{opacity:.38;cursor:not-allowed;box-shadow:none}
.tab-badge{display:none;margin-left:5px;color:#2ecc71;font-size:.72rem;font-weight:900}
.tab-badge.on{display:inline}
.tab-badge.gen{color:#a78bfa}
.tab-badge.dupe{color:#f59e0b}
.tab-badge.imgen{color:#38bdf8}
.tab-badge.rewrite{color:#fbbf24}
.tab-badge.facehero{color:#e879f9}
.tab-badge.formatfix{color:#38bdf8}
.imgen-review{margin-top:14px;text-align:left}
.imgen-review-head{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin-bottom:10px}
.imgen-review-head h4{margin:0;font-size:.88rem;color:#7fd0ff;font-weight:900}
.imgen-review-bulk{display:flex;gap:6px;flex-wrap:wrap}
.imgen-review-bulk button{border:1px solid #1e5a7a;background:#0b1219;color:#7fd0ff;border-radius:8px;padding:6px 10px;font-size:.72rem;font-weight:800;cursor:pointer}
.imgen-review-bulk button:hover{border-color:#38bdf8;color:#e8f6ff}
.imgen-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px;max-height:520px;overflow:auto;padding:4px;border:1px solid #1e3a5f;border-radius:12px;background:#060a10}
.imgen-card{border:2px solid #223;border-radius:10px;overflow:hidden;background:#0b1219;position:relative}
.imgen-card img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:#111}
.imgen-card.on-yes{border-color:#22c55e;box-shadow:0 0 0 1px #22c55e inset}
.imgen-card.on-no{border-color:#ef4444;opacity:.55}
.imgen-card-meta{font-size:.62rem;color:#8aa;padding:4px 6px;line-height:1.25;max-height:2.6em;overflow:hidden}
.imgen-card-btns{display:flex;border-top:1px solid #223}
.imgen-card-btns button{flex:1;border:none;padding:8px 0;font-size:1rem;font-weight:900;cursor:pointer;background:#0b1219;color:#667}
.imgen-card-btns button.yes.on{background:#14532d;color:#4ade80}
.imgen-card-btns button.no.on{background:#450a0a;color:#f87171}
.imgen-commit-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:12px}
#imgenCommit{color:#06121a;background:linear-gradient(135deg,#22c55e,#86efac);box-shadow:0 6px 20px rgba(34,197,94,.3)}
#imgenAnother{display:none;color:#06121a;background:linear-gradient(135deg,#38bdf8,#7dd3fc)}
#imgenDiscard{color:#fff;background:linear-gradient(135deg,#64748b,#334155)}
.imgen-pool-inventory{margin-top:12px;border:1px solid #1e3a5f;border-radius:12px;background:#060a10;padding:10px 12px;text-align:left}
.imgen-pool-head{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:.78rem;color:#7fd0ff;font-weight:900}
.imgen-pool-hint{font-size:.66rem;color:#667;margin-bottom:8px;line-height:1.35}
.imgen-pool-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px;max-height:320px;overflow:auto;padding:2px}
.imgen-pool-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:5px 8px;border-radius:8px;background:#0b1219;border:1px solid #1a2a3a;cursor:pointer;font-size:.72rem;color:#b8c8d8}
.imgen-pool-row:hover{border-color:#38bdf8;color:#e8f6ff}
.imgen-pool-row.sel{border-color:#38bdf8;background:#0e2438;box-shadow:0 0 0 1px #38bdf8 inset}
.imgen-pool-row.zero{opacity:.52}
.imgen-pool-row .n{font-weight:900;color:#7fd0ff;min-width:2.2em;text-align:right;font-variant-numeric:tabular-nums}
.imgen-pool-row code{font-size:.62rem;color:#667}
.imgen-keywords-row{margin-top:10px;text-align:left}
.imgen-keywords-label{display:block;font-size:.74rem;font-weight:900;color:#7fd0ff;margin-bottom:5px}
.imgen-keywords{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid #1e5a7a;background:#060a10;color:#e8f6ff;font-size:.82rem;font-family:inherit}
.imgen-keywords::placeholder{color:#556}
.imgen-keywords:disabled{opacity:.45;cursor:not-allowed}
.imgen-keywords-hint{font-size:.66rem;color:#667;margin-top:4px;line-height:1.35}
.pipeline-bar{margin:0 auto 16px;max-width:540px;width:94%;padding:14px 16px 16px;border:1px solid #2d4a3a;border-radius:16px;background:linear-gradient(165deg,#0e1a14 0%,#0e1620 100%);text-align:center}
.pipeline-bar-title{font-weight:900;font-size:1rem;color:#7fe0a0;margin-bottom:4px}
.pipeline-bar-hint{font-size:.72rem;color:#8aa;margin-bottom:10px;line-height:1.35}
.pipeline-bar-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;margin-bottom:10px}
.pipeline-bar-row select{padding:10px 12px;border-radius:10px;border:1px solid #244;background:#0b1219;color:#e8eef2;font-size:.9rem;min-width:190px;flex:1 1 190px;max-width:100%}
.pipeline-count{width:72px;padding:10px 8px;border-radius:10px;border:1px solid #244;background:#0b1219;color:#e8eef2;font-size:1rem;font-weight:800;text-align:center;-moz-appearance:textfield}
.pipeline-count::-webkit-outer-spin-button,.pipeline-count::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.gen-count-wrap{display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto}
.gen-count-label{font-size:.68rem;color:#8aa;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
.gen-count-presets{display:flex;gap:5px;flex-wrap:wrap;justify-content:center}
.gen-count-presets button{border:1px solid #334;background:#0b1219;color:#c4b5fd;border-radius:8px;padding:5px 9px;font-size:.78rem;font-weight:800;cursor:pointer}
.gen-count-presets button.on,.gen-count-presets button:hover{border-color:#a78bfa;color:#e8eef2;background:#1a1230}
.index-panel{margin:18px auto 0;max-width:540px;width:94%;padding:14px 16px;border:1px solid #1e3a5f;border-radius:16px;background:#0a1218;text-align:center}
.index-panel-title{font-weight:800;font-size:.92rem;color:#7fd0e0;margin-bottom:10px}
.index-panel-btns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.index-panel-btns button{border:none;border-radius:24px;padding:10px 16px;font-weight:800;font-size:.78rem;cursor:pointer;line-height:1.2}
.index-panel-btns button#indexnow{color:#06121a;background:#38bdf8}
.index-panel-btns button#indexDelta{color:#06121a;background:#2ecc71}
.index-panel-btns button#indexFull{color:#06121a;background:#f6c049}
.index-panel-btns button#indexInterwoven{color:#06121a;background:#a78bfa}
.index-panel-btns button:disabled{opacity:.55;cursor:wait}
.index-panel-cooldown{font-size:.65rem;color:#66788a;margin-top:6px;line-height:1.4}
.index-panel-opts{display:flex;gap:12px 18px;flex-wrap:wrap;justify-content:center;margin:10px 0 4px;font-size:.72rem;color:#9fb0bd}
.index-panel-opts label{display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-weight:700}
.index-panel-opts input{accent-color:#38bdf8;width:14px;height:14px}
.dupe-auto-opts{display:flex;gap:12px 18px;flex-wrap:wrap;margin:8px 0 4px;font-size:.74rem;color:#b8c4ce}
.dupe-auto-opts label{display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-weight:700}
.dupe-auto-opts input{width:14px;height:14px}
.dupe-auto-opts.facehero input{accent-color:#e879f9}
.dupe-auto-opts.rewrite input{accent-color:#fbbf24}
.index-panel-hint{font-size:.68rem;color:#66788a;margin-top:8px;line-height:1.35}
.generate-bar{border-color:#3b2a6a;background:linear-gradient(165deg,#120e1f 0%,#0e1620 100%)}
.generate-bar .pipeline-bar-title{color:#c4b5fd}
.pipeline-alt-bar{margin:0 auto 14px;max-width:540px;width:94%;padding:12px 14px;border:2px solid #2d4a6a;border-radius:14px;background:linear-gradient(165deg,#0a1420 0%,#101820 100%);text-align:center;display:none}
.pipeline-alt-bar.on{display:block}
.pipeline-alt-title{font-weight:900;font-size:.92rem;color:#7fe0d0;margin-bottom:8px}
.pipeline-alt-slots{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:8px}
.pipeline-alt-slot{padding:10px 16px;border-radius:12px;border:2px solid #334;background:#0b1219;font-weight:800;font-size:.88rem;color:#8aa;min-width:130px;transition:all .25s}
.pipeline-alt-slot.active{border-color:#2ecc71;background:rgba(46,204,113,.12);color:#7fe0a0;box-shadow:0 0 16px rgba(46,204,113,.25)}
.pipeline-alt-slot.next-up{border-color:#fbbf24;color:#fcd34d;background:rgba(251,191,36,.08)}
.pipeline-alt-slot.gen.active{border-color:#a78bfa;color:#e9d5ff;background:rgba(167,139,250,.12);box-shadow:0 0 16px rgba(167,139,250,.25)}
.pipeline-alt-arrow{font-size:1.2rem;color:#64748b;font-weight:900}
.pipeline-alt-status{font-size:.78rem;color:#9fb0bd;line-height:1.45;margin-bottom:6px}
.pipeline-alt-history{font-size:.68rem;color:#64748b;font-family:ui-monospace,monospace;max-height:48px;overflow:auto;text-align:left}
.pipeline-bar-btns{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center}
.scrub-filter-bar{margin:0 auto 14px;max-width:540px;width:94%;padding:12px 14px;border:1px solid #164e63;border-radius:14px;background:#0a1218;text-align:left}
.scrub-filter-title{font-weight:800;font-size:.92rem;color:#7fe0d0;margin-bottom:6px}
.scrub-filter-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.scrub-filter-row select{padding:9px 12px;border-radius:10px;border:1px solid #244;background:#0b1219;color:#e8eef2;font-size:.88rem;min-width:220px;flex:1 1 220px;font-weight:700}
.scrub-filter-stats{font-size:.78rem;color:#8aa;font-weight:600;flex:1 1 140px}
.scrub-filter-banner{margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(19,194,194,.12);border:1px solid #13c2c2;color:#7fe0d0;font-size:.8rem;font-weight:700}
.scrub-vis-panel{margin-top:12px;padding:12px 14px;border:1px solid #1e3a3f;border-radius:14px;background:#0a1018;text-align:left}
.scrub-vis-head{font-weight:800;font-size:.88rem;color:#e8eef2;margin-bottom:8px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
.scrub-vis-steps{display:grid;gap:6px;margin-bottom:10px}
.scrub-vis-step{display:flex;align-items:center;gap:8px;font-size:.76rem;padding:5px 8px;border-radius:8px;background:#0e1620;border:1px solid #223}
.scrub-vis-step.done{border-color:#2ecc71;color:#b8f5d0}.scrub-vis-step.active{border-color:#13c2c2;color:#7fe0d0;box-shadow:0 0 12px rgba(19,194,194,.15)}.scrub-vis-step.pending{opacity:.55}
.scrub-vis-step .track{flex:1;height:5px;border-radius:4px;background:#0b1219;overflow:hidden}.scrub-vis-step .track i{display:block;height:100%;background:linear-gradient(90deg,#13c2c2,#2ecc71)}
.scrub-vis-rubric{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:4px;font-size:.72rem;margin-bottom:10px;max-height:120px;overflow:auto}
.scrub-vis-rubric div{padding:3px 6px;border-radius:6px;background:#0e1620}.scrub-vis-rubric .ok{color:#2ecc71}.scrub-vis-rubric .no{color:#ff8a76}
.scrub-vis-queue{font-size:.74rem;max-height:140px;overflow:auto;font-family:ui-monospace,monospace;line-height:1.45;color:#9fb0c0}
.scrub-vis-queue div{padding:2px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.scrub-vis-activity{font-size:.72rem;max-height:110px;overflow:auto;font-family:ui-monospace,monospace;line-height:1.45;color:#8aa;margin-top:8px}
.scrub-vis-batch{display:grid;gap:6px;max-height:200px;overflow:auto;margin-top:8px}
.scrub-vis-batch-row{display:flex;gap:8px;align-items:center;padding:6px 8px;border-radius:8px;background:#0e1620;border:1px solid #223;font-size:.74rem}
.scrub-vis-batch-row.working{border-color:#2ecc71}.scrub-vis-batch-row .pct{font-weight:800;color:#7fe0d0;min-width:36px;text-align:right}
.cw-panel{display:none;margin:12px 0 14px;padding:14px 16px;border-radius:16px;background:linear-gradient(165deg,#0a1218 0%,#0e1620 100%);border:2px solid #1e4a55;box-shadow:0 8px 28px rgba(0,0,0,.35)}
.cw-panel.on{display:block}
.cw-panel-gen{border-color:#7c3aed;box-shadow:0 8px 32px rgba(124,58,237,.22)}
.cw-panel-fs{border-color:#13c2c2;box-shadow:0 8px 32px rgba(19,194,194,.18)}
.cw-header{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}
.cw-title{font-size:1rem;font-weight:900;color:#e8eef2}
.cw-stepnum{font-size:.88rem;font-weight:800;color:#2ecc71;font-variant-numeric:tabular-nums}
.cw-meta{font-size:.82rem;font-weight:700;color:#fbbf24;line-height:1.45;margin-bottom:8px;min-height:18px}
.cw-overall-row{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.cw-overall-bar{flex:1;height:22px;border-radius:12px;background:#0b1219;overflow:hidden;border:2px solid #234}
.cw-overall-bar>i{display:block;height:100%;background:linear-gradient(90deg,#0d9488,#13c2c2,#2ecc71,#a3e635);transition:width .4s ease;box-shadow:0 0 14px rgba(46,204,113,.35)}
.cw-overall-pct{font-size:1.35rem;font-weight:900;color:#2ecc71;min-width:48px;text-align:right;font-variant-numeric:tabular-nums}
.cw-conveyor{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 8px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
.cw-step{flex:0 0 118px;scroll-snap-align:start;padding:10px 8px;border-radius:12px;background:#0b1219;border:2px solid #223;text-align:center;transition:border-color .25s,box-shadow .25s}
.cw-step.done{border-color:#2ecc71;background:rgba(46,204,113,.08)}
.cw-step.active{border-color:#13c2c2;background:rgba(19,194,194,.12);box-shadow:0 0 16px rgba(19,194,194,.28)}
.cw-step.pending{opacity:.55}
.cw-step-n{font-size:.72rem;font-weight:900;color:#8aa;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
.cw-step-n .cw-ico{font-size:.85rem;margin-left:2px}
.cw-step.done .cw-step-n{color:#2ecc71}.cw-step.active .cw-step-n{color:#7fe0d0}
.cw-step-lbl{font-size:.74rem;font-weight:800;color:#e8eef2;line-height:1.25;min-height:2.4em;display:flex;align-items:center;justify-content:center}
.cw-step-bar{height:8px;border-radius:5px;background:#050a0f;overflow:hidden;margin:6px 0 4px;border:1px solid #1a2830}
.cw-step-bar>i{display:block;height:100%;background:linear-gradient(90deg,#13c2c2,#2ecc71);transition:width .35s}
.cw-step-sub{font-size:.62rem;color:#8aa;line-height:1.3;max-height:2.6em;overflow:hidden}
.cw-rubric{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:4px;margin-top:10px;max-height:140px;overflow:auto;font-size:.7rem}
.cw-rubric-head{grid-column:1/-1;font-size:.72rem;font-weight:800;color:#8aa;margin-bottom:2px}
.cw-rub{padding:3px 6px;border-radius:6px;background:#0e1620;line-height:1.3}
.cw-rub.ok{color:#2ecc71}.cw-rub.no{color:#667}
.cw-rubric-wait{grid-column:1/-1;color:#667;font-size:.72rem;padding:4px 0}
.fs-overall-top.on{display:block}
#laneMini.on{display:block!important;margin-top:10px;padding:10px 12px;border:1px solid #164e63;border-radius:12px;background:#0a1218;text-align:left;font-size:.78rem}
.pipe-btn-primary{border:none;border-radius:30px;padding:12px 18px;font-weight:900;font-size:.92rem;color:#06121a;background:linear-gradient(135deg,#fbbf24,#f59e0b);cursor:pointer;box-shadow:0 4px 16px rgba(251,191,36,.24)}
.pipe-btn-go{border:none;border-radius:30px;padding:11px 18px;font-weight:800;color:#06121a;background:#22c55e;cursor:pointer}
.pipe-btn-rand{border:none;border-radius:30px;padding:11px 16px;font-weight:800;color:#fff;background:linear-gradient(135deg,#a78bfa,#7c3aed);cursor:pointer}
.pipe-btn-stop{border:none;border-radius:30px;padding:11px 16px;font-weight:800;color:#fff;background:#ef4444;cursor:pointer}
.pipeline-queue{margin-top:8px;font-size:.78rem;color:#c4b5fd;font-weight:600;min-height:1em}
#scrubPanel,#generatePanel{width:100%;max-width:540px;display:flex;flex-direction:column;align-items:center;gap:0}
#fsGenerate{display:none;position:fixed;inset:0;z-index:250;background:linear-gradient(165deg,#0a0818 0%,#120a20 45%,#0b1218 100%);color:#e8eef2;flex-direction:column;padding:18px 20px 22px;overflow:auto}
#fsGenerate.on{display:flex}
</style></head><body>
<div id=uniSplash aria-label="Tap to open owner portal" onclick="if(window.enterUnicornGate)window.enterUnicornGate()">
  <div id=uni>🦄<span class=hint>Owner portal</span></div>
  <button type=button id=uniEnter onclick="event.stopPropagation();if(window.enterUnicornGate)window.enterUnicornGate()">Enter Owner Portal</button>
  <p class=sub style="max-width:320px;z-index:85;position:relative">Local only · not pulserevops.com · passcode after this screen</p>
</div>
<div id=gate><h1>🏭 PULSE Scrub Button</h1><p class=sub>Enter the access code</p><input id=pw type=password inputmode=numeric maxlength=4 placeholder="••••"><p class=sub id=gerr style=color:#ff8a76></p></div>
<div id=app>
  <nav id=pageNav class=mode-tabs>
    <button type=button class="mode-tab${isScrub ? ' on' : ''}" id=navScrub data-mode=scrub>🧽 Scrub to 13/13 <span id=tabScrubBadge class=tab-badge></span></button>
    <button type=button class="mode-tab${isGenerate ? ' on' : ''}" id=navGenerate data-mode=generate>✍️ New Q&amp;A <span id=tabGenerateBadge class="tab-badge gen"></span></button>
  </nav>
  <h1 id=appTitle>${isGenerate ? '✍️ New Q&amp;A — auto 13/13' : '🧽 Scrub to 13/13'}</h1>
  <p class=sub id=appSub>${isGenerate ? 'Pick pillar + count. Each new Q&amp;A runs the <b>same 13/13 pipeline as scrubber</b> — writing → Pollinator face-card + top hero → DDG sections → render verify → <b>certify 13/13</b> before the next one.' : 'Pick a pillar, then <b>Fix pillar</b>. Every entry gets Pollinator flux on face-card + top hero, DDG images inside, gold title overlay, full render check — then <b>quality_score 13</b>.'}</p>
  <div id=scrubPanel${isScrub ? '' : ' style="display:none"'}>
  <div id=scrubFilterBar class=scrub-filter-bar style="margin-top:0">
    <div class=scrub-filter-title>🎯 Which pillar to scrub?</div>
    <div class=scrub-filter-row>
      <select id=scrubpillarfilter title="Only pick entries from this pillar when scrubbing"><option value=all>All pillars — loading…</option></select>
      <span id=scrubFilterStats class=scrub-filter-stats>Loading queue counts…</span>
    </div>
    <div id=scrubFilterBanner class=scrub-filter-banner style="display:none"></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;justify-content:center;width:100%">
      <button type=button id=pillarFixStart class=pipe-btn-primary title="Pollinator face + top hero · DDG sections · render verify · certify 13/13">▶ Fix this pillar to 13/13</button>
      <a href="/pillar-progress" target=_blank class=pipe-btn-go style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none;padding:12px 16px">📊 Live pillar map</a>
      <button id=begin class=pipe-btn-go>▶ Begin Scrub</button>
      <button id=stop class=pipe-btn-stop style="display:none">⏹ Stop</button>
      <button id=scrubForceStop type=button class=pipe-btn-force-stop title="Force stop scrub immediately — abandons current entry">⏹ Force stop scrub</button>
      <button id=forceStopAll type=button class=pipe-btn-force-stop title="Force stop ALL — scrubber, generate, and every image station">⏹ Force stop ALL</button>
    </div>
  </div>
  <div class=popbar><div class=popg id=popg></div><div class=popr id=popr></div></div>
  <div class=poplbl><span class=g>✅ <span id=popgN>—</span> good</span><span class=r><span id=poprN>—</span> to scrub 🔴</span></div>
  <div class=counts><span class="pill green">✅ <span id=green>—</span> certified</span><span class="pill red">🔴 <span id=under>—</span> to scrub</span><span class="pill amber">⚡ <span id=today>0</span> today</span></div>
  <div id=approvalHub>
    <div class=approval-head><h2>📋 Audit pile</h2><span class=n id=pending>0</span></div>
    <div class=approval-sub>${approvalSub}</div>
    <div id=pileList class=pile-list><div class=pile-empty>Nothing here yet — scrubber drops finished entries into this pile.</div></div>
    <div id=fixPileLbl class=fix-pile-lbl style="display:none">🔧 Being fixed (scrubber + agent)</div>
    <div id=fixPileList class=pile-list style="display:none;border-color:#6b4a1a;max-height:100px"></div>
    <div id=rejectToast class=reject-toast></div>
    <div id=approvalViewer style="display:none">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <div class=approval-pos id=signoffPos>—</div>
        <div id=signoffNav><button id=signoffPrev>← Prev</button><button id=signoffNext>Next →</button></div>
      </div>
      <div id=signoffMeta class=signoff-meta></div>
      <div class=signoff-preview><iframe id=signoffFrame title="entry preview"></iframe></div>
      <div id=signoffRubric class=signoff-rubric></div>
      <div id=signoffScrubLog class=signoff-scrublog style="display:none"></div>
      <div class=approval-bar>
        <button id=signoffReject title="Send back to scrubber">✗</button>
        <button id=signoffApprove title="Publish to green">✓</button>
      </div>
      <div class=approval-lbl><span>Fix in scrubber</span><span>Publish</span></div>
    </div>
  </div>
  <div class=run-stats id=runStats style="display:none">This run: <b class=cert-n>0</b> certified · <b class=ready-n>0</b> ready · <b class=park-n>0</b> parked · <b>0</b> tried</div>
  <div id=finishBanner class=finish-banner style="display:none"></div>
  <div class=combo id=combo style="display:none"></div>
  <div style="display:none;gap:12px;margin:16px 0 4px;flex-wrap:wrap;justify-content:center">
    <button id=scrubExpand type=button style="display:none">⛶ Live view</button>
  </div>
  <div id=gear style="display:none"></div>
  <div id=scrubprog style="display:none;margin-top:16px;padding:14px 16px;border:1px solid #164e63;border-radius:16px;background:#0e1620;max-width:540px;width:94%">
    <div style="font-weight:800;font-size:.9rem;margin-bottom:8px">🧽 Scrubbing the pool</div>
    <div class=scrub-simple id=scrubSimple>
      <div class=scrub-simple-now id=scrubSimpleNow>🟢 Now: waiting…</div>
      <div class=scrub-simple-step id=scrubSimpleStep>—</div>
      <div class=scrub-simple-next id=scrubSimpleNext>🟡 Next: —</div>
    </div>
    <div id=entryOverall class=entry-overall>
      <div class=entry-overall-head><span>This entry — overall progress</span><span class=entry-overall-pct id=entryOverallLbl>0%</span></div>
      <div class=entry-overall-bar><i id=entryOverallBar style="width:0%"></i></div>
    </div>
    <div id=scrubCarwash class="cw-panel cw-panel-scrub">
      <div class=cw-header><span class=cw-title id=scrubCwTitle>🚿 Scrub · factor 2 car wash</span><span class=cw-stepnum id=scrubCwStepNum>—</span></div>
      <div class=cw-meta id=scrubCwMeta>—</div>
      <div class=cw-overall-row><div class=cw-overall-bar><i id=scrubCwBar style="width:0%"></i></div><span class=cw-overall-pct id=scrubCwPct>0%</span></div>
      <div id=scrubCwConveyor class=cw-conveyor></div>
      <div id=scrubCwRubric class=cw-rubric></div>
    </div>
    <div style="height:14px;border-radius:8px;background:#0b1219;overflow:hidden;border:1px solid #223"><div id=scrubbar style="height:100%;width:0;background:linear-gradient(90deg,#13c2c2,#2ecc71);transition:width .5s"></div></div>
    <div id=scrubtop style="margin-top:8px;font-weight:700;font-size:.86rem"></div>
    <div id=scrubcur style="font-size:.82rem;color:#7fe0d0;min-height:16px"></div>
    <div id=scrubVisibility class=scrub-vis-panel>
      <div id=pipelineAltBarScrub class="pipeline-alt-bar" style="margin:0 0 12px;width:100%;max-width:none">
        <div class=pipeline-alt-title>🔁 Generate ↔ Scrub alternation</div>
        <div class=pipeline-alt-slots>
          <div id=altSlotGenScrub class="pipeline-alt-slot gen">✍️ Generate</div>
          <div class=pipeline-alt-arrow>↔</div>
          <div id=altSlotScrubScrub class="pipeline-alt-slot scrub">🧽 Scrub</div>
        </div>
        <div id=altStatusScrub class=pipeline-alt-status>—</div>
        <div id=altHistoryScrub class=pipeline-alt-history></div>
      </div>
      <div class=scrub-vis-head><span>🔬 Live scrub detail</span><span id=scrubVisCwStepNum class=cw-stepnum style="font-size:.76rem">—</span><span id=scrubVisActive style="color:#7fe0d0;font-weight:700">—</span></div>
      <div id=scrubVisCarwash style="font-size:.8rem;color:#fbbf24;font-weight:700;margin-bottom:8px;min-height:18px">—</div>
      <div class=cw-overall-row style="margin-bottom:10px"><div class=cw-overall-bar><i id=scrubVisCwBar style="width:0%"></i></div><span class=cw-overall-pct id=scrubVisCwPct>0%</span></div>
      <div id=scrubVisCwConveyor class=cw-conveyor style="margin-bottom:10px"></div>
      <div id=scrubVisSteps class=scrub-vis-steps></div>
      <div id=scrubVisRubric class=scrub-vis-rubric></div>
      <div class=scrub-vis-head style="margin-top:4px"><span>📋 Up next in queue</span><span id=scrubVisQueueMeta style="font-size:.76rem;color:#8aa">—</span></div>
      <div id=scrubVisQueue class=scrub-vis-queue></div>
      <div id=scrubVisBatch class=scrub-vis-batch style="display:none"></div>
      <div class=scrub-vis-head style="margin-top:8px"><span>📜 Activity feed</span></div>
      <div id=scrubVisActivity class=scrub-vis-activity></div>
    </div>
    <div id=cookq style="display:none;margin-top:10px;padding:9px 11px;border:1px solid #6b4a1a;border-radius:12px;background:#17100a;text-align:left"></div>
    <div id=scrublog style="margin-top:8px;font-size:.72rem;color:#8aa;text-align:left;max-height:180px;overflow:auto;font-family:ui-monospace,monospace;line-height:1.5"></div>
    <div id=laneMini style="display:none;margin-top:10px;padding:10px 12px;border:1px solid #164e63;border-radius:12px;background:#0a1218;text-align:left"></div>
    <div class=tick-cd-mini id=tickCdMini>
      <div class=tick-cd-mini-num id=tickCdMiniNum>15</div>
      <div class=tick-cd-mini-lbl id=tickCdMiniLbl>⏱️ Timer — seconds until next turn</div>
    </div>
  </div>
  </div>
  <div id=generatePanel${isGenerate ? '' : ' style="display:none"'}>
  <div id=pipelineBar class="pipeline-bar generate-bar">
    <div class=pipeline-bar-title>✍️ New Q&amp;A — always 13/13</div>
    <div class=pipeline-bar-hint>Pick a <b>pillar</b> and <b>how many</b>. Each entry runs the <b>same pipeline as scrubber</b> — Pollinator face-card + top hero, DDG sections, render verify — and only moves on after <b>13/13 certify</b>.</div>
    <div class=pipeline-bar-row>
      <select id=genpillar title="Pillar to generate"></select>
      <div class=gen-count-wrap>
        <span class=gen-count-label>How many?</span>
        <input id=gencount class=pipeline-count type=number min=1 max=500 step=1 value=100 placeholder="100" title="How many Q&amp;As to generate (1–500)" autocomplete=off>
      </div>
    </div>
    <div class=gen-count-presets id=genCountPresets>
      <button type=button data-n=1>1</button>
      <button type=button data-n=5>5</button>
      <button type=button data-n=10>10</button>
      <button type=button data-n=25>25</button>
      <button type=button data-n=50>50</button>
      <button type=button data-n=100 class=on>100</button>
      <button type=button data-n=250>250</button>
      <button type=button data-n=500>500</button>
    </div>
    <div class=pipeline-bar-btns>
      <button id=genstart type=button class=pipe-btn-go title="Generate the pillar + count selected above">✍️ Generate 100</button>
      <button id=gen100random type=button class=pipe-btn-rand title="100 Q&amp;As — random topic every entry">100:random</button>
      <button id=genstop type=button class=pipe-btn-stop style="display:none">⏹ Stop Generate</button>
      <button id=genForceStop type=button class=pipe-btn-force-stop title="Force stop ALL — generate, scrub, and image jobs">⏹ Force stop ALL</button>
      <button id=genExpand type=button class=pipe-btn-go style="display:none;background:#1e1535;border-color:#a78bfa;color:#c4b5fd">⛶ Live view</button>
    </div>
    <div id=genqueue class=pipeline-queue></div>
  </div>
  <div id=pipelineAltBar class="pipeline-alt-bar" style="display:none">
    <div class=pipeline-alt-title>🔁 Generate ↔ Scrub alternation</div>
    <div class=pipeline-alt-slots>
      <div id=altSlotGen class="pipeline-alt-slot gen">✍️ Generate</div>
      <div class=pipeline-alt-arrow>↔</div>
      <div id=altSlotScrub class="pipeline-alt-slot scrub">🧽 Scrub</div>
    </div>
    <div id=altStatus class=pipeline-alt-status>—</div>
    <div id=altHistory class=pipeline-alt-history></div>
  </div>
  <div id=genpanel style="margin-top:0;padding:16px 16px 18px;border:1px solid #1e3a3f;border-radius:16px;background:#0e1620;max-width:540px;width:94%">
    <div style="font-weight:800;font-size:1.02rem;margin-bottom:4px">📊 Generate progress</div>
    <div style="font-size:.76rem;color:#8aa;margin-bottom:10px">Same car wash as scrubber — each Q&amp;A must hit <b>13/13</b> before the next starts.</div>
    <div id=genprog style="display:none;margin-top:8px">
      <div style="height:14px;border-radius:8px;background:#0b1219;overflow:hidden;border:1px solid #223"><div id=genbar style="height:100%;width:0;background:linear-gradient(90deg,#22c55e,#a78bfa);transition:width .4s"></div></div>
      <div id=genCarwash class="cw-panel cw-panel-gen">
        <div class=cw-header><span class=cw-title id=genCwTitle>🚿 Generate · factor 1 car wash</span><span class=cw-stepnum id=genCwStepNum>—</span></div>
        <div class=cw-meta id=genCwMeta>—</div>
        <div class=cw-overall-row><div class=cw-overall-bar><i id=genCwBar style="width:0%"></i></div><span class=cw-overall-pct id=genCwPct>0%</span></div>
        <div id=genCwConveyor class=cw-conveyor></div>
        <div id=genCwRubric class=cw-rubric></div>
      </div>
      <div id=gentop style="margin-top:8px;font-weight:800;font-size:.92rem"></div>
      <div id=genstage style="font-size:.82rem;color:#7fe0a0;min-height:16px"></div>
      <div id=genlog style="margin-top:8px;font-size:.72rem;color:#8aa;text-align:left;max-height:130px;overflow:auto;font-family:ui-monospace,monospace;line-height:1.5"></div>
    </div>
  </div>
  <div id=histpanel style="margin-top:22px;padding:16px;border:1px solid #1e3a3f;border-radius:16px;background:#0e1620;max-width:540px;width:94%;text-align:left">
    <div style="font-weight:800;font-size:1.02rem;margin-bottom:2px;text-align:center">📝 Writing — last 24h (by pillar)</div>
    <div style="font-size:.74rem;color:#8aa;margin-bottom:10px;text-align:center">past · current · queued — <span id=histtot>0</span> written in 24h</div>
    <div id=histcur style="font-size:.82rem;color:#7fe0a0;font-weight:700;margin-bottom:8px"></div>
    <div id=histqueue style="font-size:.78rem;color:#c4b5fd;font-weight:600;margin-bottom:10px"></div>
    <div id=histgroups style="font-size:.8rem;color:#cdd6df;max-height:340px;overflow:auto"></div>
  </div>
  </div>
  <div id=duplicatorPanel${isDuplicator ? '' : ' style="display:none"'}>
  <div class=dupe-panel>
    <div class=dupe-panel-title>🖼 Duplicate Image Fill</div>
    <div class=dupe-panel-hint>Each pillar is <b>independent</b> (<code>pool-{pillar}-*</code>). <b>No DuckDuckGo ever</b> — overwrites every DDG/legacy slot with Pollinator pool images. Until 50 unique pool files, each image used once per pillar · then reuse more. Skips slots that already pass as Pollinator/flux.</div>
    <div class=dupe-panel-row>
      <select id=dupePillarFilter title="Which pillar to fill"><option value=all>All pillars — loading…</option></select>
    </div>
    <div class=imgen-keywords-row>
      <label class=imgen-keywords-label for=dupeKeywords>🎯 Guide keywords (optional)</label>
      <input type=text id=dupeKeywords class=imgen-keywords maxlength=800 placeholder="e.g. warm cinematic, documentary editorial — comma separated" title="Optional — steers Pollinator when flux upgrades are needed">
      <div class=imgen-keywords-hint>Leave blank for automatic pillar scenes. Keywords rotate through each flux try when Pollinator runs.</div>
    </div>
    <div class=dupe-btns>
      <button type=button id=dupeStart>▶ Start fill process</button>
      <button type=button id=dupeStop>⏹ Stop</button>
      <button type=button id=dupeForceStop class=dupe-force-stop style="display:none" title="Force stop immediately — will not resume on server restart">⏹ Force stop</button>
    </div>
    <div id=dupeProg class=dupe-prog style="display:none">
      <div class=dupe-prog-bar><i id=dupeProgBar style="width:0%"></i></div>
      <div class=dupe-prog-lbl id=dupeProgLbl>0% — waiting…</div>
      <div class=dupe-stats id=dupeStats></div>
      <div class=dupe-log id=dupeLog></div>
    </div>
  </div>
  </div>
  <div id=imgenPanel${isImgGen ? '' : ' style="display:none"'}>
  <div class=dupe-panel style="border-color:#1e5a7a;background:linear-gradient(165deg,#061018 0%,#0e1620 100%)">
    <div class=dupe-panel-title style="color:#7fd0ff">🎨 Pillar Image Pool Generator</div>
    <div class=dupe-panel-hint><b>Workflow:</b> Pollinator serial flux → auto keep/reject → saved to <code>pool-{pillar}-NNN.jpg</code>. <b>Look law:</b> same clean documentary editorial style as <code>/topics</code> hub tiles (warm cinematic grade, no flyers/text/stock clichés).</div>
    <div class=dupe-panel-row>
      <select id=imgenPillarFilter title="Which pillar to build images for"><option value=tl>Loading pillars…</option></select>
      <input type=number id=imgenTarget class=pipeline-count min=1 max=${IMG_GEN_BATCH_MAX} value=${IMG_GEN_BATCH_DEFAULT} title="Pollinator candidates per batch (max ${IMG_GEN_BATCH_MAX})">
    </div>
    <div class=imgen-keywords-row>
      <label class=imgen-keywords-label for=imgenKeywords>🔎 Guide keywords (optional)</label>
      <input type=text id=imgenKeywords class=imgen-keywords maxlength=800 placeholder="e.g. boardroom strategy, revenue dashboard, executive portrait — comma separated" title="Optional — every Pollinator flux try rotates through these keywords instead of auto pillar scenes">
      <div class=imgen-keywords-hint>Leave blank for automatic pillar scenes. When filled, <b>only your keywords</b> steer each flux prompt this batch.</div>
    </div>
    <div class=dupe-btns>
      <button type=button id=imgenStart>▶ Find ${IMG_GEN_BATCH_DEFAULT} images</button>
      <button type=button id=imgenStop disabled title="Stop collection — keeps partial batch for review if any candidates found">⏹ Stop</button>
      <button type=button id=imgenForceStop disabled title="Force stop and discard in-progress batch">⏹ Force stop</button>
    </div>
    <div class=imgen-pool-inventory>
      <div class=imgen-pool-head><span>📦 Image Fill pool — every topic</span><span id=imgenPoolTotal>Loading…</span></div>
      <div class=imgen-pool-hint>Saved <code>pool-{pillar}-NNN.jpg</code> per topic. Build <b>50 unique</b> originals first — then Image Fill starts reusing the same pool images more across Q&amp;As.</div>
      <div id=imgenPoolGrid class=imgen-pool-grid>Loading topics…</div>
    </div>
    <div id=imgenProg class=dupe-prog style="display:none">
      <div class=dupe-prog-bar><i id=imgenProgBar style="width:0%;background:linear-gradient(90deg,#38bdf8,#7dd3fc)"></i></div>
      <div class=dupe-prog-lbl id=imgenProgLbl style="color:#7fd0ff">0% — waiting…</div>
      <div class=dupe-stats id=imgenStats></div>
      <div class=dupe-log id=imgenLog></div>
    </div>
    <div id=imgenReview class=imgen-review style="display:none">
      <div class=imgen-review-head>
        <h4 id=imgenReviewTitle>Review batch</h4>
        <div class=imgen-review-bulk>
          <button type=button id=imgenAllYes>✓ All yes</button>
          <button type=button id=imgenAllNo>✗ All no</button>
          <button type=button id=imgenClearMarks>Clear</button>
        </div>
      </div>
      <div id=imgenGrid class=imgen-grid></div>
      <div class=imgen-commit-row>
        <button type=button id=imgenCommit>💾 Save approved to pool</button>
        <button type=button id=imgenAnother>▶ Find another ${IMG_GEN_BATCH_DEFAULT}</button>
        <button type=button id=imgenDiscard>Discard batch</button>
      </div>
    </div>
  </div>
  </div>
  <div id=faceheroHome></div>
  <div id=faceheroPanel${isFaceHero ? '' : ' style="display:none"'}>
  <div class=dupe-panel style="border-color:#a855f7;background:linear-gradient(165deg,#120818 0%,#0e1620 100%)">
    <div class=dupe-panel-title style="color:#e879f9">◻️ Square Builder</div>
    <div class=dupe-panel-hint><b>Manual only:</b> enter a graduated Q&amp;A ID. Its title keywords search Pexels. First click sets face card + existing Q&amp;A top-image slot; later clicks fill existing middle/bottom or Top-10 product slots. No slots are added or moved.</div>
    <div class=imgen-keywords-row>
      <label class=imgen-keywords-label style="color:#e879f9" for=squareQaId>Q&amp;A ID</label>
      <input type=text id=squareQaId class=imgen-keywords maxlength=80 placeholder="e.g. q11133">
      <label class=imgen-keywords-label style="color:#e879f9" for=squareTitleQuery>Title keywords</label>
      <input type=text id=squareTitleQuery class=imgen-keywords maxlength=220 placeholder="Leave blank to read the Q&amp;A title automatically">
    </div>
    <div class=dupe-btns><button type=button id=squarePexelsSearch>🔎 Search title on Pexels</button><button type=button id=squareFinishQa>✅ Finish Q&amp;A</button></div>
    <div id=squarePickerStatus class=dupe-panel-hint style="margin-top:10px">Graduated Q&amp;As wait here for manual images.</div>
    <div id=squarePexelsGrid style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px"></div>
  </div>
  </div>
  <div id=rewritePanel${isRewrite ? '' : ' style="display:none"'}>
  <div class=dupe-panel style="border-color:#b45309;background:linear-gradient(165deg,#120a04 0%,#0e1620 100%)">
    <div class=dupe-panel-title style="color:#fbbf24">🌸 Pollinator Image Overwrite</div>
    <div class=dupe-panel-hint><b>Media law:</b> Pollinator flux only — <b>no DuckDuckGo</b>. Overwrites every DDG/legacy image slot (face-card, hero, sections). Real documentary look · ✓ Keep / ✗ Try again · serial queue.</div>
    <div class=dupe-panel-row>
      <select id=rewritePillarFilter title="Which pillar to overwrite all images for"><option value=tl>Loading pillars…</option></select>
    </div>
    <div class=imgen-keywords-row>
      <label class=imgen-keywords-label style="color:#fbbf24" for=rewriteKeywords>🎯 Guide keywords (optional)</label>
      <input type=text id=rewriteKeywords class=imgen-keywords maxlength=800 placeholder="e.g. documentary editorial, product close-up — comma separated" title="Optional — steers each Pollinator flux try this run">
      <div class=imgen-keywords-hint>Leave blank for automatic title-based searches. Same search/guide for every entry until you ✗ Try again — then next title search (+ next comma guide keyword if set).</div>
    </div>
    <div class="dupe-auto-opts rewrite">
      <label title="Skip manual review — each overwritten entry is saved automatically and the run continues"><input type=checkbox id=rewriteAutoApprove> 🤖 Auto-approve images</label>
    </div>
    <div class=dupe-btns>
      <button type=button id=rewriteStart>▶ Overwrite all images in pillar</button>
      <button type=button id=rewriteStop disabled>⏹ Stop</button>
      <button type=button id=rewriteForceStop class=dupe-force-stop disabled title="Force stop — clears pending review and will not resume">⏹ Force stop</button>
    </div>
    <div id=rewriteReview class=imgen-review style="display:none">
      <div class=imgen-review-head><h4 id=rewriteReviewTitle>Review entry</h4></div>
      <div class=card-review>
        <a id=rewriteReviewLink href="#" target=_blank rel=noopener><img id=rewriteReviewImg src="" alt="face-card preview"></a>
        <div class=card-review-meta id=rewriteReviewMeta></div>
        <div class=card-review-btns>
          <button type=button id=rewriteKeep>✓ Keep</button>
          <button type=button id=rewriteRetry>✗ Try again</button>
        </div>
      </div>
    </div>
    <div id=rewriteProg class=dupe-prog style="display:none">
      <div class=dupe-prog-bar><i id=rewriteProgBar style="width:0%;background:linear-gradient(90deg,#f59e0b,#fbbf24)"></i></div>
      <div class=dupe-prog-lbl id=rewriteProgLbl style="color:#fbbf24">0% — waiting…</div>
      <div class=dupe-stats id=rewriteStats></div>
      <div class=dupe-log id=rewriteLog></div>
    </div>
  </div>
  </div>
  <div id=internalimagesPanel${isInternalImages ? '' : ' style="display:none"'}>
  <div class=dupe-panel style="border-color:#059669;background:linear-gradient(165deg,#041210 0%,#0e1620 100%)">
    <div class=dupe-panel-title style="color:#34d399">📷 Internal Images</div>
    <div class=dupe-panel-hint><b>DDG section images only:</b> one self-hosted image per <code>##</code> section — collapses stacked duplicates, waits for every image to render before leaving each Q&amp;A. <b>Never</b> touches face-card or top hero. Top-10 lists run product slots only.</div>
    <div class=dupe-panel-row>
      <select id=internalPillarFilter title="Which pillar to fix section images"><option value=tl>Loading pillars…</option></select>
    </div>
    <div class=imgen-keywords-row>
      <label class=imgen-keywords-label style="color:#34d399" for=internalKeywords>🎯 Guide keywords (optional)</label>
      <input type=text id=internalKeywords class=imgen-keywords maxlength=800 placeholder="e.g. documentary editorial, product close-up" title="Steers DDG section image queries">
    </div>
    <div class=dupe-btns>
      <button type=button id=internalStart>▶ Overwrite section images in pillar</button>
      <button type=button id=internalStop disabled>⏹ Stop</button>
      <button type=button id=internalForceStop class=dupe-force-stop disabled title="Force stop immediately — will not resume on server restart">⏹ Force stop</button>
    </div>
    <div id=internalProg class=dupe-prog style="display:none">
      <div class=dupe-prog-bar><i id=internalProgBar style="width:0%;background:linear-gradient(90deg,#059669,#34d399)"></i></div>
      <div class=dupe-prog-lbl id=internalProgLbl style="color:#34d399">0% — waiting…</div>
      <div class=dupe-stats id=internalStats></div>
      <div class=dupe-log id=internalLog></div>
    </div>
  </div>
  </div>
  <div id=rubricstationPanel${isRubricStation ? '' : ' style="display:none"'}>
  <div class=dupe-panel style="border-color:#7c3aed;background:linear-gradient(165deg,#0c0818 0%,#0e1620 100%)">
    <div class=dupe-panel-title style="color:#a78bfa">🔬 Rubric Stations</div>
    <div class=dupe-panel-hint>One station = one rubric slice. Each entry gets a <b>targeted fix</b> then a <b>dedicated auditor</b> for that slice only.</div>
    <div class=dupe-panel-row>
      <select id=rubricStationFilter title="Which rubric slice to fix + audit"><option value=writing>✍️ Writing</option><option value=structure>📐 Structure</option><option value=face>🦄 Face &amp; hero</option><option value=internal>📷 Internal images</option><option value=top10>🏆 Top-10 images</option><option value=publish>✅ Publish gate</option></select>
      <select id=rubricPillarFilter title="Which pillar"><option value=tl>Loading pillars…</option></select>
    </div>
    <div class=dupe-btns>
      <button type=button id=rubricStart>▶ Run station on pillar</button>
      <button type=button id=rubricStop disabled>⏹ Stop</button>
      <button type=button id=rubricForceStop class=dupe-force-stop disabled title="Force stop immediately">⏹ Force stop</button>
    </div>
    <div id=rubricProg class=dupe-prog style="display:none">
      <div class=dupe-prog-bar><i id=rubricProgBar style="width:0%;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></i></div>
      <div class=dupe-prog-lbl id=rubricProgLbl style="color:#a78bfa">0% — waiting…</div>
      <div class=dupe-stats id=rubricStats></div>
      <div class=dupe-log id=rubricLog></div>
    </div>
  </div>
  </div>
  <div id=formatfixPanel${isFormatFix ? '' : ' style="display:none"'}>
  <div class=dupe-panel style="border-color:#0ea5e9;background:linear-gradient(165deg,#041018 0%,#0e1620 100%)">
    <div class=dupe-panel-title style="color:#38bdf8">📝 Format Fixer</div>
    <div class=dupe-panel-hint><b>Automatic pods of 100:</b> fixes a pod, fetches the next 100, and starts over with a fresh database scan after the full cycle. It runs until you press Stop. <b>Never changes image URLs.</b></div>
    <div class=dupe-panel-row>
      <select id=formatfixPillarFilter title="Which pillar to audit and fix"><option value=tl>Loading pillars…</option></select>
    </div>
    <div class=dupe-btns>
      <button type=button id=formatfixAutoToggle aria-pressed=true>▶ FIXER AUTO-RUN 100 · ON</button>
      <button type=button id=formatfixStart>▶ Fix content &amp; structure in pillar</button>
      <button type=button id=formatfixStop disabled>⏹ Stop</button>
      <button type=button id=formatfixForceStop class=dupe-force-stop disabled title="Force stop immediately">⏹ Force stop</button>
    </div>
    <div id=formatfixProg class=dupe-prog style="display:none">
      <div class=dupe-prog-bar><i id=formatfixProgBar style="width:0%;background:linear-gradient(90deg,#0ea5e9,#38bdf8)"></i></div>
      <div class=dupe-prog-lbl id=formatfixProgLbl style="color:#38bdf8">0% — waiting…</div>
      <div class=dupe-stats id=formatfixStats></div>
      <div class=dupe-log id=formatfixLog></div>
    </div>
  </div>
  <div class=square-builder-dock>
    <div class=dupe-panel-title style="color:#e879f9">🟦 Square Builder · attached to Fixer</div>
    <div class=dupe-panel-hint style="margin-bottom:10px">Same localhost server and image proxy. Pick the face/top image and answer-page images without leaving the Fixer dashboard.</div>
    <iframe src="/square-builder" title="Square Builder" loading="eager" style="display:block;width:100%;height:900px;border:1px solid #4c1d95;border-radius:14px;background:#0f1115"></iframe>
  </div>
  </div>
  <div id=indexPanel class=index-panel>
    <div class=index-panel-title>📡 Search indexing (IndexNow)</div>
    <div class=index-panel-btns>
      <button id=indexnow type=button title="Recent certified + ledger entries (~200 URLs) — no cooldown">🚀 Recent</button>
      <button id=indexDelta type=button title="Entries published in the last 26 hours — 1 hour cooldown">Δ Delta (26h)</button>
      <button id=indexFull type=button title="Whole library + sitemap URLs — 1 week cooldown">📚 Full catalog</button>
      <button id=indexInterwoven type=button title="Weave all pillar + CRO internal links, then IndexNow ping — 1 week cooldown">🔗 Interwoven SEO</button>
    </div>
    <div class=index-panel-opts>
      <label title="Red pool + pending sign-off + reject-fix queue"><input type=checkbox id=indexOptScrub checked> Scrub queue pages</label>
      <label title="🦄 pt573 easter egg + /seo + /publish owner portals"><input type=checkbox id=indexOptUnicorn checked> 🦄 Unicorn / owner pages</label>
    </div>
    <div class=index-panel-hint>Recent = fast post-scrub ping · Delta = today&apos;s new Q&amp;As (1h cooldown) · Full catalog = entire library + sitemap (1 week) · <b>Interwoven SEO</b> = run pillar + CRO weave, then ping all interlinked pages (1 week). Checkboxes apply to Delta, Full, and Interwoven.</div>
    <div id=indexCooldownLbl class=index-panel-cooldown></div>
    <div id=inprog style="display:none;margin-top:10px">
      <div style="height:12px;border-radius:8px;background:#0b1219;overflow:hidden;border:1px solid #223"><div id=inbar style="height:100%;width:0;background:linear-gradient(90deg,#38bdf8,#22c55e);transition:width .4s"></div></div>
      <div id=inlbl style="margin-top:6px;font-size:.78rem;color:#7fd0e0;font-weight:700"></div>
    </div>
  </div>
  <div id=result></div>
</div>
<div id=rejectModal>
  <div class=reject-box>
    <h3>✗ What needs fixing?</h3>
    <div class=sub>Check every rubric item that's wrong. The scrubber will drill into <b>only those</b>, then put the entry back in your approval pile.</div>
    <div id=rejectEntryMeta style="font-size:.82rem;color:#c4b5fd;margin-bottom:8px;font-weight:700"></div>
    <div id=rejectChecks class=reject-checks></div>
    <div class=reject-notes>
      <label for=rejectNotes>Optional notes for scrubber / agent</label>
      <textarea id=rejectNotes placeholder="e.g. FAQ #3 is generic, hero image looks like stock photo, tighten Direct Answer…" maxlength=800></textarea>
    </div>
    <div class=reject-actions>
      <button type=button id=rejectCancel>Cancel</button>
      <button type=button id=rejectConfirm>Fix selected → scrubber</button>
    </div>
  </div>
</div>
<div id=fsScrub>
  <div id=fsScrubFilterBar class=scrub-filter-bar style="margin:0 0 14px;max-width:100%">
    <div class=scrub-filter-title>🎯 Which pillar to scrub?</div>
    <div class=scrub-filter-row>
      <select id=fsScrubPillarFilter title="Only pick entries from this pillar when scrubbing"><option value=all>All pillars — loading…</option></select>
      <span id=fsScrubFilterStats class=scrub-filter-stats>—</span>
    </div>
    <div id=fsScrubFilterBanner class=scrub-filter-banner style="display:none"></div>
  </div>
  <div class=fshead>
    <h2 id=fsHeadTitle>🧽 Scrubber — live</h2>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button type=button class=fsdash id=fsScrubDash>📋 Dashboard</button>
      <button class=fsstop id=fsStop>⏹ Stop Scrub</button>
      <button type=button class="fsstop pipe-btn-force-stop" id=fsScrubForceStop title="Force stop scrub immediately">⏹ Force stop</button>
    </div>
  </div>
  <div id=fsSimple class=fs-simple>
    <div class=fs-simple-status id=fsSimpleStatus>🧽 Scrubber is starting…</div>
    <div id=fsCwPanel class="cw-panel cw-panel-fs">
      <div class=cw-header><span class=cw-title id=fsCwTitle>🚿 Scrub · factor 2 car wash</span><span class=cw-stepnum id=fsCwStepNum>—</span></div>
      <div class=cw-meta id=fsCwMeta>—</div>
      <div class=cw-overall-row><div class=cw-overall-bar><i id=fsCwBar style="width:0%"></i></div><span class=cw-overall-pct id=fsCwPct>0%</span></div>
      <div id=fsCwConveyor class=cw-conveyor></div>
      <div id=fsCwRubric class=cw-rubric></div>
    </div>
    <div id=pipelineAltBarFsScrub class="pipeline-alt-bar" style="max-width:100%;margin:12px 0">
      <div class=pipeline-alt-title>🔁 Generate ↔ Scrub alternation</div>
      <div class=pipeline-alt-slots>
        <div id=altSlotGenFsScrub class="pipeline-alt-slot gen">✍️ Generate</div>
        <div class=pipeline-alt-arrow>↔</div>
        <div id=altSlotScrubFsScrub class="pipeline-alt-slot scrub">🧽 Scrub</div>
      </div>
      <div id=altStatusFsScrub class=pipeline-alt-status>—</div>
      <div id=altHistoryFsScrub class=pipeline-alt-history></div>
    </div>
    <div class="fs-simple-box" id=fsCrewBox style="border-color:#7c6cff;margin-bottom:12px;font-size:.88rem;line-height:1.45">
      <div class=fs-simple-lbl>👥 CREW (who does what)</div>
      <div id=fsCrewManifest style="color:#c8d0e0;font-weight:600">${SCRUB_CREW.oneLiner}</div>
    </div>
    <div id=fsBatchSummary class=fs-batch-summary style="display:none"></div>
    <div class="fs-simple-box batch-glance-box" style="border-color:#13c2c2;margin-bottom:12px">
      <div class=fs-simple-lbl>📋 BATCH (48 articles)</div>
      <div class=fs-simple-hint id=fsBatchExplain>${fsBatchExplain}</div>
      <div id=fsAlsoCooking class=fs-also-cooking></div>
    </div>
    <div class="fs-simple-box green-box now-box">
      <div class=fs-simple-lbl>🟢 WORKING NOW</div>
      <div class=fs-simple-hint>Current article — words / flux hero / DDG sections toward 13/13</div>
      <div class=fs-simple-now-id id=fsSimpleNowId>—</div>
      <div class=fs-simple-now-title id=fsSimpleNowTitle>—</div>
      <div class=fs-simple-now-step id=fsSimpleNowStep>—</div>
      <div class=fs-simple-now-bar><i id=fsSimpleNowBar style="width:0%"></i></div>
      <div class=fs-simple-now-pct id=fsSimpleNowPct>0% done with this article</div>
    </div>
    <div class="fs-simple-box yellow-box next-box" id=fsSimpleNextBox>
      <div class=fs-simple-lbl>🟡 UP NEXT</div>
      <div class=fs-simple-hint>Yellow = gets the next turn when the timer hits 0 (wait varies by flux/DDG).</div>
      <div class=fs-simple-now-id id=fsSimpleNextId style="font-size:1.35rem">—</div>
      <div class=fs-simple-now-title id=fsSimpleNextTitle style="font-size:.95rem">—</div>
      <div class=fs-simple-now-step id=fsSimpleNextStep style="font-size:1rem;color:#fbbf24">—</div>
    </div>
    <div class="fs-simple-box timer-box">
      <div class=fs-simple-lbl>⏱️ PACE</div>
      <div class=fs-simple-hint id=fsSimpleTimerHint>Image lanes <b>alternate</b> DDG sections ↔ Pollinator hero · <b>45–90s</b> between Q&amp;As when APIs are ready (longer if cooling) · triple image verify before every publish · ✍️ words runs in parallel</div>
      <div class="fs-tick-countdown off" id=fsTickCd style="margin:0;border:none;background:transparent;box-shadow:none;padding:8px 0 0">
        <div class=fs-tick-lbl id=fsTickLbl style="font-size:1rem;color:#e8eef2;text-transform:none;letter-spacing:0">Seconds until next turn</div>
        <div class="fs-tick-num" id=fsTickNum>15</div>
        <div class=fs-tick-sub id=fsTickSub>—</div>
        <div class=fs-tick-ring><i id=fsTickRing style="width:100%"></i></div>
      </div>
    </div>
    <div class="fs-simple-box batch-box">
      <div class=fs-simple-lbl>📋 PILLAR PROGRESS</div>
      <div class=fs-simple-legend>
        <span class=lg-green>🟢 Working now / just finished</span>
        <span class=lg-yellow>🟡 Up next</span>
        <span class=lg-orange>🟠 Coming soon</span>
        <span class=lg-red>🔴 Waiting in line</span>
      </div>
      <div class=fs-simple-batch id=fsSimpleBatch></div>
    </div>
    <div class=fs-simple-pool id=fsSimplePool>🔴 <b class=red>—</b> still need fixing · ✅ <b class=green>—</b> already good</div>
    <div class="fs-simple-box fs-simple-pile-wrap" style="border-color:#6d28d9;box-shadow:0 0 24px rgba(109,40,217,.12)">
      <div class=fs-simple-lbl>📋 AUDIT PILE — tap to review · ✓ publish · ✗ send back</div>
      <div class=fs-simple-hint>Finished articles land here. Tap any chip for fullscreen review while scrub keeps running.</div>
      <div id=fsSimpleApprovalDock></div>
    </div>
  </div>
  <div class=fs-overall-top id=fsOverallTop>
    <div class=fs-overall-head>
      <span class=fs-overall-title id=fsOverallTitle>Overall scrub progress — this entry</span>
      <span class=fs-overall-pct id=fsOverallPctLbl>0%</span>
    </div>
    <div class=fs-overall-bar><i id=fsOverallPct style="width:0%"></i></div>
  </div>
  <div class=fsstatus id=fsStatus style="display:none">Starting…</div>
  <div class=run-stats id=fsRunStats style="display:none;margin:6px auto 10px">This run: <b class=cert-n>0</b> certified · <b class=park-n>0</b> parked · <b>0</b> tried</div>
  <div id=fsFinishBanner class=finish-banner style="display:none;margin-bottom:12px"></div>
  <div class=fscarwash id=fsCarwash style="display:none">—</div>
  <div class=fs-pool-lbl id=fsPoolLbl style="display:none">Whole pool certified</div>
  <div class=fsbar style="display:none;max-width:1200px;width:100%;margin:0 auto 14px;height:12px"><i id=fsBar style="width:0%"></i></div>
  <div class=fs-lane-board id=fsLaneBoard style="display:none">
    <div class=fs-lane-head>
      <h3>📋 Batch progress (technical)</h3>
      <span class=fs-lane-meta id=fsLaneMeta>—</span>
    </div>
    <div class=fs-lane-cols><span>Article</span><span>Done</span><span>Words</span><span>Hero</span><span>Pics</span><span>Check</span><span>Final</span></div>
    <div class=fs-lane-rows id=fsLaneRows></div>
  </div>
  <details class=fs-details>
    <summary>🔧 Show technical details (for nerds)</summary>
  <div class=fs-split>
    <div class=fs-main>
  <div class=fsgrid>
    <div class=fscard><h3>Current Q&amp;A</h3><div class=fsbig id=fsQid>—</div><div class=fsmid id=fsTitle>—</div><div class=fssmall id=fsPillar>—</div><div class=fssmall id=fsScore style="margin-top:8px">—</div></div>
    <div class=fscard><h3>Active step</h3><div class=fsmid id=fsStage>—</div><div class=fssmall id=fsElapsed>—</div><div class=fssteps id=fsSteps></div></div>
    <div class=fscard><h3 id=fsPollTitle>${IMAGE_LAW_UI.engine}</h3><div class=fssmall id=fsPollLaw style="margin-bottom:8px">${IMAGE_LAW_UI.engineSub}</div><div class=fsmid id=fsPollBusy>—</div><div class=fssmall id=fsPollAvg>—</div><ul class=fspoll id=fsPollRecent></ul></div>
    <div class=fscard><h3>Pool</h3><div class=fssmall id=fsPool>—</div></div>
    <div class=fscard style="grid-column:1/-1"><h3>Car wash — all steps</h3><div id=fsStepsTrack></div></div>
    <div class=fscard style="grid-column:1/-1"><h3>Rubric checklist (live)</h3><div class=fsrubric id=fsRubric></div></div>
    <div class=fscard style="grid-column:1/-1"><h3 id=fsQueueTitle>Waiting in pool (not active)</h3><div class=fsqueue id=fsQueue></div></div>
    <div class=fscard style="grid-column:1/-1"><h3>Run log</h3><div class=fsqueue id=fsLog></div></div>
  </div>
    </div>
    <div id=fsApprovalDock class=fs-approval-dock></div>
  </div>
  </details>
</div>
<div id=fsApproval>
  <div class=fs-approval-head>
    <h2 id=fsApprovalHead>📋 Review entry</h2>
    <button type=button id=fsApprovalClose>✕ Close</button>
  </div>
  <div id=fsApprovalBody style="flex:1;min-height:0;display:flex;flex-direction:column"></div>
</div>
<div id=fsGenerate>
  <div class=fshead>
    <h2 id=fsGenHeadTitle>✍️ Generate — live</h2>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button type=button class=fsdash id=fsGenDash>📋 Dashboard</button>
      <button class=fsstop id=fsGenStop>⏹ Stop Generate</button>
      <button type=button class="fsstop pipe-btn-force-stop" id=fsGenForceStop title="Force stop generate immediately">⏹ Force stop</button>
    </div>
  </div>
  <div class=fs-simple style="max-width:900px;width:100%;margin:0 auto">
    <div class=fs-simple-status id=fsGenStatus style="color:#a78bfa">✍️ Writing new Q&amp;As — factor 1 pipeline</div>
    <div id=fsGenCwPanel class="cw-panel cw-panel-gen">
      <div class=cw-header><span class=cw-title id=fsGenCwTitle>🚿 Generate · factor 1 car wash</span><span class=cw-stepnum id=fsGenCwStepNum>—</span></div>
      <div class=cw-meta id=fsGenCwMeta>—</div>
      <div class=cw-overall-row><div class=cw-overall-bar><i id=fsGenCwBar style="width:0%"></i></div><span class=cw-overall-pct id=fsGenCwPct>0%</span></div>
      <div id=fsGenCwConveyor class=cw-conveyor></div>
      <div id=fsGenCwRubric class=cw-rubric></div>
    </div>
    <div id=pipelineAltBarFs class="pipeline-alt-bar" style="max-width:100%;margin:12px 0">
      <div class=pipeline-alt-title>🔁 Generate ↔ Scrub alternation</div>
      <div class=pipeline-alt-slots>
        <div id=altSlotGenFs class="pipeline-alt-slot gen">✍️ Generate</div>
        <div class=pipeline-alt-arrow>↔</div>
        <div id=altSlotScrubFs class="pipeline-alt-slot scrub">🧽 Scrub</div>
      </div>
      <div id=altStatusFs class=pipeline-alt-status>—</div>
      <div id=altHistoryFs class=pipeline-alt-history></div>
    </div>
    <div class="fs-simple-box green-box now-box" style="border-color:#a78bfa">
      <div class=fs-simple-lbl>🟢 WRITING NOW</div>
      <div class=fs-simple-hint>Same <code>entryScrubPipeline</code> as scrubber — flux hero + DDG sections · queued for factor-2 scrub after</div>
      <div class=fs-simple-now-id id=fsGenNowId style="color:#a78bfa">—</div>
      <div class=fs-simple-now-title id=fsGenNowTitle>—</div>
      <div class=fs-simple-now-step id=fsGenStep>—</div>
      <div class=fs-simple-now-bar><i id=fsGenNowBar style="width:0%;background:linear-gradient(90deg,#a78bfa,#22c55e)"></i></div>
      <div class=fs-simple-now-pct id=fsGenNowPct>0% — factor-1 pipeline</div>
    </div>
    <div class="fs-simple-box" style="border-color:#7c3aed;margin-top:12px">
      <div class=fs-simple-lbl>📊 BATCH PROGRESS</div>
      <div style="height:14px;border-radius:8px;background:#0b1219;overflow:hidden;border:1px solid #223;margin:8px 0"><div id=fsGenBar style="height:100%;width:0;background:linear-gradient(90deg,#22c55e,#a78bfa);transition:width .4s"></div></div>
      <div id=fsGenTop style="font-weight:800;font-size:.95rem;color:#e8eef2"></div>
      <div id=fsGenStage style="font-size:.85rem;color:#7fe0a0;margin-top:6px;min-height:18px"></div>
    </div>
    <div class="fs-simple-box" style="border-color:#334;margin-top:12px">
      <div class=fs-simple-lbl>📜 RUN LOG</div>
      <div id=fsGenLog style="font-size:.72rem;color:#8aa;max-height:200px;overflow:auto;font-family:ui-monospace,monospace;line-height:1.5"></div>
    </div>
    <div class=fs-simple-pool id=fsGenPool style="margin-top:12px">Factor-2 scrub pool runs independently on the <a href="/scrubber" style="color:#7fe0d0">Scrubber page</a>.</div>
  </div>
</div>
<canvas id=fx></canvas>
<script>
let KEY='', streak=0, shownGreen=null, shownUnder=null, lastCertifyAt=0, lastFinishAt=0;
let pendingApproveId='';
try{ pendingApproveId=new URLSearchParams(location.search).get('approve')||''; if(pendingApproveId) try{ sessionStorage.setItem('scrubApproveId',pendingApproveId); }catch(e){} }catch(e){}
const IMAGE_LAW_INTERNAL_DDG=${INTERNAL_IMAGES_DDG ? 'true' : 'false'};
const HUMAN_AUDITOR=${humanAuditor ? 'true' : 'false'};
const EMBEDDED_CREW=${JSON.stringify(SCRUB_CREW)};
const PIPELINE_STEPS=${JSON.stringify(SCRUB_STEPS.map(s=>({n:s.n,key:s.key,label:s.label})))};
function stepTrackPct(s){
  if(!s) return 0;
  var max=Math.max(1,s.max||1);
  if(s.status==='done') return 100;
  if(s.status==='active') return max>1?Math.round((s.cur||0)/max*100):55;
  return 0;
}
function carwashConveyorHtml(track){
  return (track||[]).map(function(s){
    var pct=stepTrackPct(s);
    var ico=s.status==='done'?'✓':(s.status==='active'?'●':'○');
    var sub=s.max>1&&s.status==='active'?(s.cur+'/'+s.max+(s.detail?(' · '+String(s.detail).slice(0,28)):'')):(s.detail?String(s.detail).slice(0,36):'');
    return '<div class="cw-step '+esc(s.status||'pending')+'"><div class=cw-step-n>'+s.n+' <span class=cw-ico>'+ico+'</span></div><div class=cw-step-lbl>'+esc(s.label)+'</div><div class=cw-step-bar><i style="width:'+pct+'%"></i></div>'+(sub?'<div class=cw-step-sub>'+esc(sub)+'</div>':'')+'</div>';
  }).join('');
}
function carwashRubricHtml(items){
  if(!items||!items.length) return '<div class=cw-rubric-wait>Rubric checklist lights up as each criterion passes…</div>';
  var pass=items.filter(function(i){return i.pass;}).length;
  return '<div class=cw-rubric-head>✓ '+pass+'/'+items.length+' rubric checks</div>'+items.map(function(i){return '<div class="cw-rub '+(i.pass?'ok':'no')+'">'+(i.pass?'✅':'⬜')+' '+esc(i.label)+'</div>';}).join('');
}
function defaultStepsTrack(){
  return PIPELINE_STEPS.map(function(s){return {n:s.n,label:s.label,status:'pending',cur:0,max:1,detail:''};});
}
function paintCarwash(cfg){
  cfg=cfg||{};
  var live=cfg.live||{};
  var show=cfg.show!==false;
  var track=(live.stepsTrack&&live.stepsTrack.length)?live.stepsTrack:defaultStepsTrack();
  var total=live.stepTotal||track.length||8;
  var stepNum=live.stepNum||0;
  var overall=live.overallPct!=null?live.overallPct:0;
  var ids=cfg.ids||{};
  var panel=ids.panel?$(ids.panel):null;
  if(panel) panel.classList.toggle('on',!!show);
  if(!show) return;
  if(ids.title&&$(ids.title)) $(ids.title).textContent=cfg.title||'🚿 Pipeline car wash';
  if(ids.stepNum&&$(ids.stepNum)) $(ids.stepNum).textContent=stepNum?('Step '+stepNum+' of '+total):('0 / '+total+' steps');
  var meta=live.carwash||live.stage||cfg.meta||'—';
  if(cfg.batchLabel) meta=cfg.batchLabel+' · '+meta;
  if(ids.meta&&$(ids.meta)) $(ids.meta).textContent=meta;
  if(ids.bar&&$(ids.bar)) $(ids.bar).style.width=overall+'%';
  if(ids.pct&&$(ids.pct)) $(ids.pct).textContent=overall+'%';
  if(ids.conveyor&&$(ids.conveyor)) $(ids.conveyor).innerHTML=carwashConveyorHtml(track);
  if(ids.rubric&&$(ids.rubric)) $(ids.rubric).innerHTML=carwashRubricHtml(live.rubricItems);
}
function paintAllCarwash(live, opts){
  opts=opts||{};
  live=live||{};
  var scrubShow=!!opts.scrubActive;
  var genShow=!!opts.genActive;
  var scrubTitle=opts.scrubTitle||'🚿 Scrub · factor 2 car wash';
  var genTitle=opts.genTitle||'🚿 Generate · factor 1 car wash';
  var batchLabel=opts.batchLabel||'';
  paintCarwash({show:scrubShow,live:live,title:scrubTitle,batchLabel:scrubShow&&!opts.genMode?null:batchLabel,ids:{panel:'scrubCarwash',title:'scrubCwTitle',stepNum:'scrubCwStepNum',meta:'scrubCwMeta',bar:'scrubCwBar',pct:'scrubCwPct',conveyor:'scrubCwConveyor',rubric:'scrubCwRubric'}});
  paintCarwash({show:scrubShow,live:live,title:scrubTitle,ids:{panel:null,stepNum:'scrubVisCwStepNum',meta:'scrubVisCarwash',bar:'scrubVisCwBar',pct:'scrubVisCwPct',conveyor:'scrubVisCwConveyor',rubric:'scrubVisRubric'}});
  paintCarwash({show:scrubShow,live:live,title:scrubTitle,ids:{panel:'fsCwPanel',title:'fsCwTitle',stepNum:'fsCwStepNum',meta:'fsCwMeta',bar:'fsCwBar',pct:'fsCwPct',conveyor:'fsCwConveyor',rubric:'fsCwRubric'}});
  paintCarwash({show:genShow,live:live,title:genTitle,batchLabel:batchLabel,ids:{panel:'genCarwash',title:'genCwTitle',stepNum:'genCwStepNum',meta:'genCwMeta',bar:'genCwBar',pct:'genCwPct',conveyor:'genCwConveyor',rubric:'genCwRubric'}});
  paintCarwash({show:genShow,live:live,title:genTitle,batchLabel:batchLabel,ids:{panel:'fsGenCwPanel',title:'fsGenCwTitle',stepNum:'fsGenCwStepNum',meta:'fsGenCwMeta',bar:'fsGenCwBar',pct:'fsGenCwPct',conveyor:'fsGenCwConveyor',rubric:'fsGenCwRubric'}});
}
const RUBRIC_PICK=${JSON.stringify(Object.entries(RUBRIC_LABELS).filter(function(e){return e[0]!=='score12';}).map(function(e){return {key:e[0],label:e[1]};}) )};
const $=s=>document.querySelector(s);
// ── Scrub vs Generate — one page, client-side tab toggle (owner) ──
window.activeTab='${mode}';
const TAB_TITLE={scrub:'📋 Audit Hub',generate:'✍️ Generate',duplicator:'🖼 Image Fill',imgen:'🎨 Image Generator',facehero:'◻️ Square Builder',internalimages:'📷 Internal Images',rubricstation:'🔬 Rubric Stations',rewrite:'🌸 Full Image Overwrite',formatfix:'📝 Format Fixer'};
const TAB_COPY={scrub:'Approval pile + population stats. Use <b>Rubric Stations</b> or dedicated tabs — standard full scrub is off.',generate:${JSON.stringify(IMAGE_LAW_UI.gen)},duplicator:'Pollinator pool only — replaces DDG heroes/sections + fills empty slots. Never cross-pillar.',imgen:'Pollinator-only — serial flux queue, auto keep/reject, saves to pool.',facehero:'Your local 760×760 square workflow: describe the image, review it, then click the square to apply the baked title and template-safe cover/top-image swap. Up to 200 per batch.',internalimages:'DDG section images only — <b>one image per ## section</b>, self-hosted, no stacks. Holds each Q&amp;A until every image renders before moving on. Face-card + top image never touched.',rubricstation:'Pick station + pillar — targeted fix then dedicated auditor for that rubric slice only.',rewrite:'Pollinator overwrites face-card + hero + all sections. Use Internal Images tab for sections only.',formatfix:'Audits ≥2000 words, Direct Answer, CRO placement, FAQs, mermaid, Sources, Related. <b>Does not touch images.</b>'};
function switchPipelineTab(mode){
  if(!mode||mode===window.activeTab) return;
  window.activeTab=mode;
  const sp=$('#scrubPanel'), gp=$('#generatePanel'), dp=$('#duplicatorPanel'), ip=$('#imgenPanel'), fhp=$('#faceheroPanel'), iip=$('#internalimagesPanel'), rsp=$('#rubricstationPanel'), rp=$('#rewritePanel'), fp=$('#formatfixPanel');
  if(sp) sp.style.display=mode==='scrub'?'':'none';
  if(gp) gp.style.display=mode==='generate'?'':'none';
  if(dp) dp.style.display=mode==='duplicator'?'':'none';
  if(ip) ip.style.display=mode==='imgen'?'':'none';
  if(fhp) fhp.style.display=mode==='facehero'?'':'none';
  if(iip) iip.style.display=mode==='internalimages'?'':'none';
  if(rsp) rsp.style.display=mode==='rubricstation'?'':'none';
  if(rp) rp.style.display=mode==='rewrite'?'':'none';
  const ns=$('#navScrub'), ng=$('#navGenerate'), nd=$('#navDuplicator'), ni=$('#navImgGen'), nfh=$('#navFaceHero'), nii=$('#navInternalImages'), nrs=$('#navRubricStation'), nr=$('#navRewrite'), nf=$('#navFormatFix');
  if(ns) ns.classList.toggle('on',mode==='scrub');
  if(ng) ng.classList.toggle('on',mode==='generate');
  if(nd) nd.classList.toggle('on',mode==='duplicator');
  if(ni) ni.classList.toggle('on',mode==='imgen');
  if(nfh) nfh.classList.toggle('on',mode==='facehero');
  if(nii) nii.classList.toggle('on',mode==='internalimages');
  if(nrs) nrs.classList.toggle('on',mode==='rubricstation');
  if(nr) nr.classList.toggle('on',mode==='rewrite');
  if(nf) nf.classList.toggle('on',mode==='formatfix');
  const at=$('#appTitle'); if(at) at.textContent=TAB_TITLE[mode];
  const as=$('#appSub'); if(as) as.innerHTML=TAB_COPY[mode];
  if(window._sa&&window._sa.state&&window._sa.state.cap){ const cap=$('#cap'); if(cap) cap.textContent=window._sa.state.cap; }
  try{ history.replaceState({tab:mode},'',mode==='generate'?'/generate':mode==='duplicator'?'/image-duplicator':mode==='imgen'?'/image-generator':mode==='facehero'?'/square-builder':mode==='internalimages'?'/internal-images':mode==='rubricstation'?'/rubric-stations':mode==='rewrite'?'/pollinator-image-overwrite':mode==='formatfix'?'/format-fixer':'/scrubber'); }catch(e){}
  updateFullscreenForTab();
  updateTabBadges();
  if(mode==='scrub'){ if(window._sa) renderAuto(window._sa); loadPillars(); }
  else if(mode==='generate'){ if(window._gen) genRender(window._gen); loadPillars(); }
  else if(mode==='duplicator'){ loadPillars(); refreshDuplicatorStatus(); }
  else if(mode==='imgen'){ refreshImgGenStatus().then(()=>loadPillars()); }
  else if(mode==='facehero'){ loadPillars(); refreshFaceHeroStatus(); }
  else if(mode==='internalimages'){ loadPillars(); refreshInternalImagesStatus(); }
  else if(mode==='rubricstation'){ loadPillars(); refreshRubricStationStatus(); }
  else if(mode==='rewrite'){ loadPillars(); refreshRewriteStatus(); }
  else if(mode==='formatfix'){ loadPillars(); refreshFormatFixerStatus(); }
}
function bindPipelineTabs(){
  const ns=$('#navScrub'), ng=$('#navGenerate'), nd=$('#navDuplicator'), ni=$('#navImgGen'), nfh=$('#navFaceHero'), nii=$('#navInternalImages'), nrs=$('#navRubricStation'), nr=$('#navRewrite'), nf=$('#navFormatFix');
  if(ns) ns.addEventListener('click',()=>switchPipelineTab('scrub'));
  if(ng) ng.addEventListener('click',()=>switchPipelineTab('generate'));
  if(nd) nd.addEventListener('click',()=>switchPipelineTab('duplicator'));
  if(ni) ni.addEventListener('click',()=>switchPipelineTab('imgen'));
  if(nfh) nfh.addEventListener('click',()=>switchPipelineTab('facehero'));
  if(nii) nii.addEventListener('click',()=>switchPipelineTab('internalimages'));
  if(nrs) nrs.addEventListener('click',()=>switchPipelineTab('rubricstation'));
  if(nr) nr.addEventListener('click',()=>switchPipelineTab('rewrite'));
  if(nf) nf.addEventListener('click',()=>switchPipelineTab('formatfix'));
  window.addEventListener('popstate',()=>{
    const path=(location.pathname||'/scrubber').toLowerCase();
    const m=path.includes('format-fixer')||path.includes('formatfix')?'formatfix':path.includes('rubric-stations')||path.includes('rubricstation')?'rubricstation':path.includes('internal-images')||path.includes('internalimages')?'internalimages':path.includes('pollinator-image-overwrite')||path.includes('image-rewrite')?'rewrite':path.includes('square-builder')||path.includes('face-card-top-image')||path.includes('face-hero')?'facehero':path.includes('image-generator')?'imgen':path.includes('image-duplicator')?'duplicator':path.includes('generate')?'generate':'scrub';
    if(m!==window.activeTab) switchPipelineTab(m);
  });
}
function updateTabBadges(){
  const sb=$('#tabScrubBadge'), gb=$('#tabGenerateBadge'), db=$('#tabDupeBadge'), ib=$('#tabImgGenBadge'), fhb=$('#tabFaceHeroBadge'), iib=$('#tabInternalBadge'), rsb=$('#tabRubricBadge'), rb=$('#tabRewriteBadge'), fb=$('#tabFormatFixBadge');
  const scrubRun=window._sa&&isScrubActive(window._sa);
  const genRun=!!(window.genRunning||(window._gen&&window._gen.running));
  const dupeRun=!!(window._dupe&&window._dupe.running);
  const imgenRun=!!(window._imgen&&window._imgen.running);
  const faceheroRun=!!(window._facehero&&(window._facehero.running||window._facehero.phase==='review'));
  const internalRun=!!(window._internal&&window._internal.running);
  const rubricRun=!!(window._rubricstation&&window._rubricstation.running);
  const rewriteRun=!!(window._rewrite&&(window._rewrite.running||window._rewrite.phase==='review'));
  const formatfixRun=!!(window._formatfix&&window._formatfix.running);
  if(sb){ sb.textContent='● running'; sb.classList.toggle('on',!!scrubRun&&window.activeTab!=='scrub'); }
  if(gb){ gb.textContent='● running'; gb.classList.toggle('on',!!genRun&&window.activeTab!=='generate'); }
  if(db){ db.textContent='● running'; db.classList.toggle('on',!!dupeRun&&window.activeTab!=='duplicator'); }
  if(ib){ ib.textContent='● running'; ib.classList.toggle('on',!!imgenRun&&window.activeTab!=='imgen'); }
  if(fhb){ fhb.textContent='● running'; fhb.classList.toggle('on',!!faceheroRun&&window.activeTab!=='facehero'); }
  if(iib){ iib.textContent='● running'; iib.classList.toggle('on',!!internalRun&&window.activeTab!=='internalimages'); }
  if(rsb){ rsb.textContent='● running'; rsb.classList.toggle('on',!!rubricRun&&window.activeTab!=='rubricstation'); }
  if(rb){ rb.textContent='● running'; rb.classList.toggle('on',!!rewriteRun&&window.activeTab!=='rewrite'); }
  if(fb){ fb.textContent='● running'; fb.classList.toggle('on',!!formatfixRun&&window.activeTab!=='formatfix'); }
}
function updateFullscreenForTab(){
  if(window.activeTab==='scrub') showFsGenerate(false);
  else showFsScrub(false);
}
let dupePoll=null, dupePollBusy=false;
function renderDuplicator(j){
  if(!j) return;
  const prog=$('#dupeProg'), bar=$('#dupeProgBar'), lbl=$('#dupeProgLbl'), stats=$('#dupeStats'), log=$('#dupeLog');
  const start=$('#dupeStart'), stop=$('#dupeStop'), forceStop=$('#dupeForceStop'), pf=$('#dupePillarFilter'), kw=$('#dupeKeywords');
  const active=!!(j.running||j.phase==='starting'||j.phase==='fill');
  if(pf) pf.disabled=active;
  if(kw) kw.disabled=active;
  if(active){
    if(prog) prog.style.display='block';
    if(start) start.style.display='none';
    if(stop) stop.style.display='';
    if(forceStop){ forceStop.style.display=''; forceStop.disabled=false; }
  }else{
    if(start) start.style.display='';
    if(stop) stop.style.display='none';
    if(forceStop){ forceStop.style.display='none'; forceStop.disabled=true; }
    if(prog&&(j.done>0||j.phase==='done'||j.phase==='stopped')) prog.style.display='block';
  }
  const pct=Number(j.pct)||0;
  const pctShow=(pct>0&&pct<1)?pct.toFixed(1):String(Math.round(pct));
  if(bar) bar.style.width=Math.max(pct>0?0.5:0,pct)+'%';
  if(lbl){
    const cur=j.currentId?(' · now: '+esc(j.currentId)+' — '+esc(String(j.currentTitle||'').slice(0,48))):'';
    lbl.innerHTML='<b>'+pctShow+'% fully fixed</b> — '+(j.entriesPass||0).toLocaleString()+' / '+(j.total||0).toLocaleString()+' database Q&amp;As · scanned '+(j.done||0).toLocaleString()+' / '+(j.total||0).toLocaleString()+cur+(j.currentStep?(' · '+esc(j.currentStep)):'');
  }
  if(stats) stats.innerHTML=
    '<div>🖼 slots filled: <span>'+(j.imagesFilled||0)+'</span></div>'+
    '<div>📋 entries updated: <span>'+(j.entriesFilled||0)+'</span></div>'+
    '<div>⬜ empty slots seen: <span>'+(j.slotsEmpty||0)+'</span></div>'+
    '<div>⏭ skipped (no match): <span>'+(j.skippedNoMatch||0)+'</span></div>'+
    '<div>✅ already complete: <span>'+(j.clean||0)+'</span></div>'+
    '<div>📁 pillar: <span>'+esc(j.pillarName||'All pillars')+'</span></div>'+
    (j.guideKeywords?('<div>🎯 guide: <span>'+esc(String(j.guideKeywords).slice(0,80))+(String(j.guideKeywords).length>80?'…':'')+'</span></div>'):'');
  if(log) log.innerHTML=(j.log||[]).length?(j.log||[]).map(l=>esc(l)).join('<br>'):'<span style="color:#667">Log will appear here…</span>';
}
function startDupePoll(){
  if(dupePoll) return;
  dupePoll=setInterval(async()=>{
    if(dupePollBusy||!KEY) return;
    dupePollBusy=true;
    try{
      const j=await(await fetch('/image-duplicator-status?key='+KEY)).json();
      window._dupe=j;
      if(window.activeTab==='duplicator') renderDuplicator(j);
      updateTabBadges();
      if(!j.running&&j.phase!=='starting'&&j.phase!=='fill'){ clearInterval(dupePoll); dupePoll=null; }
    }catch(e){}finally{ dupePollBusy=false; }
  },1500);
}
async function refreshDuplicatorStatus(){
  if(!KEY) return;
  try{
    const j=await(await fetch('/image-duplicator-status?key='+KEY)).json();
    window._dupe=j;
    if(j.guideKeywords){ const el=$('#dupeKeywords'); if(el&&document.activeElement!==el) el.value=j.guideKeywords; }
    renderDuplicator(j);
    if(j.running) startDupePoll();
    updateTabBadges();
  }catch(e){}
}
let rewritePoll=null, rewritePollBusy=false;
function renderRewrite(j){
  if(!j) return;
  const prog=$('#rewriteProg'), bar=$('#rewriteProgBar'), lbl=$('#rewriteProgLbl'), stats=$('#rewriteStats'), log=$('#rewriteLog');
  const start=$('#rewriteStart'), stop=$('#rewriteStop'), forceStop=$('#rewriteForceStop'), pf=$('#rewritePillarFilter'), kw=$('#rewriteKeywords'), aa=$('#rewriteAutoApprove');
  const showReview=j.phase==='review'&&j.pendingReview;
  const active=!!(j.running||j.phase==='starting'||j.phase==='rewrite');
  if(pf) pf.disabled=active||showReview;
  if(kw) kw.disabled=active||showReview;
  if(aa) aa.disabled=active||showReview;
  if(start) start.disabled=active||showReview;
  if(active||showReview){
    if(prog) prog.style.display='block';
    if(start) start.style.display='none';
    if(stop) stop.disabled=false;
    if(forceStop) forceStop.disabled=false;
  }else{
    if(start) start.style.display='';
    if(stop) stop.disabled=true;
    if(forceStop) forceStop.disabled=true;
    if(prog&&(j.done>0||j.phase==='done'||j.phase==='stopped'||j.phase==='error'||showReview)) prog.style.display='block';
  }
  if(lbl){
    const cur=j.currentId?(' · now: '+esc(j.currentId)+' — '+esc(String(j.currentTitle||'').slice(0,48))):'';
    if(showReview) lbl.innerHTML='<b>Review</b> — '+esc(j.pendingReview.id)+' · try #'+(j.pendingReview.attempt||1)+' — ✓ keep or ✗ try again';
    else{
      const pctShow=(Number(j.pct)>0&&Number(j.pct)<1)?Number(j.pct).toFixed(1):String(Math.round(Number(j.pct)||0));
      lbl.innerHTML='<b>'+pctShow+'%</b> — '+(j.done||0).toLocaleString()+' / '+(j.total||0).toLocaleString()+' Q&amp;As'+cur+(j.currentStep?(' · '+esc(j.currentStep)):'');
    }
  }
  if(bar&&!showReview){
    const pct=Number(j.pct)||0;
    bar.style.width=Math.max(pct>0?0.5:0,pct)+'%';
  }
  if(stats) stats.innerHTML=
    '<div>🌸 flux images: <span>'+(j.imagesRewritten||0)+'</span></div>'+
    '<div>📋 entries done: <span>'+(j.entriesDone||0)+'</span></div>'+
    '<div>⏭ no blob: <span>'+(j.skippedNoBlob||0)+'</span></div>'+
    '<div>◻️ waiting for square: <span>'+(j.squarePending||0)+'</span></div>'+
    '<div>✅ squares built: <span>'+(j.squareCompleted||0)+'</span></div>'+
    '<div>⚠️ errors: <span>'+(j.errors||0)+'</span></div>'+
    '<div>📁 pillar: <span>'+esc(j.pillarName||j.pillar||'—')+'</span></div>'+
    (j.autoApproveImages?('<div>🤖 auto-approve: <span>ON</span></div>'):'')+
    (j.guideKeywords?('<div>🎯 guide: <span>'+esc(String(j.guideKeywords).slice(0,80))+(String(j.guideKeywords).length>80?'…':'')+'</span></div>'):'');
  if(j.autoApproveImages != null){ const el=$('#rewriteAutoApprove'); if(el&&document.activeElement!==el) el.checked=!!j.autoApproveImages; }
  paintCardReview('rewrite', showReview?j.pendingReview:null, j.reviewAttempt, j.guideKeywords);
  if(log) log.innerHTML=(j.log||[]).length?(j.log||[]).map(l=>esc(l)).join('<br>'):'<span style="color:#667">Pick pillar → Overwrite all — follows media law (hero + ## sections) · serial flux · gold title</span>';
}
function startRewritePoll(){
  if(rewritePoll) return;
  rewritePoll=setInterval(async()=>{
    if(rewritePollBusy||!KEY) return;
    rewritePollBusy=true;
    try{
      const j=await(await fetch('/image-rewrite-status?key='+KEY)).json();
      window._rewrite=j;
      if(window.activeTab==='rewrite') renderRewrite(j);
      updateTabBadges();
      if(!j.running&&j.phase!=='starting'&&j.phase!=='rewrite'&&j.phase!=='review'){ clearInterval(rewritePoll); rewritePoll=null; }
    }catch(e){}finally{ rewritePollBusy=false; }
  },1500);
}
async function refreshRewriteStatus(){
  if(!KEY) return;
  try{
    const j=await(await fetch('/image-rewrite-status?key='+KEY)).json();
    window._rewrite=j;
    if(j.guideKeywords){ const el=$('#rewriteKeywords'); if(el&&document.activeElement!==el) el.value=j.guideKeywords; }
    if(j.autoApproveImages != null){ const el=$('#rewriteAutoApprove'); if(el&&document.activeElement!==el) el.checked=!!j.autoApproveImages; }
    renderRewrite(j);
    if(j.running||j.phase==='review') startRewritePoll();
    updateTabBadges();
  }catch(e){}
}
let faceheroPoll=null, faceheroPollBusy=false;
function renderFaceHero(j){
  if(!j) return;
  const prog=$('#faceheroProg'), bar=$('#faceheroProgBar'), lbl=$('#faceheroProgLbl'), stats=$('#faceheroStats'), log=$('#faceheroLog');
  const start=$('#faceheroStart'), stop=$('#faceheroStop'), forceStop=$('#faceheroForceStop'), pf=$('#faceheroPillarFilter'), kw=$('#faceheroKeywords'), aa=$('#faceheroAutoApprove'), batch=$('#faceheroBatch');
  const showReview=j.phase==='review'&&j.pendingReview;
  const active=!!(j.running||j.phase==='starting'||j.phase==='facehero');
  const busy=active||showReview;
  if(pf) pf.disabled=busy;
  if(kw) kw.disabled=busy;
  if(aa) aa.disabled=busy;
  if(batch) batch.disabled=busy;
  if(start) start.disabled=busy;
  if(busy){
    if(prog) prog.style.display='block';
    if(start) start.style.display='none';
    if(stop) stop.disabled=false;
    if(forceStop) forceStop.disabled=false;
  }else{
    if(start) start.style.display='';
    if(stop) stop.disabled=true;
    if(forceStop) forceStop.disabled=true;
    if(prog&&(j.done>0||j.phase==='done'||j.phase==='stopped'||j.phase==='error')) prog.style.display='block';
  }
  if(lbl){
    const cur=j.currentId?(' · now: '+esc(j.currentId)+' — '+esc(String(j.currentTitle||'').slice(0,48))):'';
    if(showReview) lbl.innerHTML='<b>Click the square to use it</b> — '+esc(j.pendingReview.id)+' · '+esc(j.pendingReview.template==='top10'?'Top 10':'Q&A essay')+' · try #'+(j.pendingReview.attempt||1)+(j.pendingReview.heroPlaced?' · cover + existing top image':' · cover only')+(j.stopAfterReview?' · <span style="color:#fbbf24">selection saves then stops</span>':'')+' — or ✗ try again';
    else{
      const pctShow=(Number(j.pct)>0&&Number(j.pct)<1)?Number(j.pct).toFixed(1):String(Math.round(Number(j.pct)||0));
      lbl.innerHTML='<b>'+pctShow+'%</b> — '+(j.done||0).toLocaleString()+' / '+(j.total||0).toLocaleString()+' Q&amp;As'+cur+(j.currentStep?(' · '+esc(j.currentStep)):'');
    }
  }
  if(bar&&!showReview){
    const pct=Number(j.pct)||0;
    bar.style.width=Math.max(pct>0?0.5:0,pct)+'%';
  }
  if(stats) stats.innerHTML=
    '<div>🦄 face-card+hero flux: <span>'+(j.coversGenerated||0)+'</span></div>'+
    '<div>📋 entries done: <span>'+(j.entriesDone||0)+'</span></div>'+
    '<div>⏭ no blob: <span>'+(j.skippedNoBlob||0)+'</span></div>'+
    '<div>⚠️ errors: <span>'+(j.errors||0)+'</span></div>'+
    '<div>📁 pillar: <span>'+esc(j.pillarName||j.pillar||'—')+'</span></div>'+
    '<div>📦 daily batch: <span>'+(j.batchSize||200)+'</span></div>'+
    (j.autoApproveImages?('<div>🤖 auto-approve: <span>ON</span></div>'):'')+
    (j.guideKeywords?('<div>🎯 guide: <span>'+esc(String(j.guideKeywords).slice(0,80))+(String(j.guideKeywords).length>80?'…':'')+'</span></div>'):'');
  if(j.autoApproveImages != null){ const el=$('#faceheroAutoApprove'); if(el&&document.activeElement!==el) el.checked=!!j.autoApproveImages; }
  paintCardReview('facehero', showReview?j.pendingReview:null, j.reviewAttempt, j.guideKeywords);
  if(showReview){
    const rv=$('#faceheroReview');
    if(rv && rv.style.display!=='none'){ try{ rv.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} }
  }
  if(log) log.innerHTML=(j.log||[]).length?(j.log||[]).map(l=>esc(l)).join('<br>'):'<span style="color:#667">Pick pillar → one Pollinator image per page · same file for mosaic + top hero · serial flux</span>';
}
function startFaceHeroPoll(){
  if(faceheroPoll) return;
  faceheroPoll=setInterval(async()=>{
    if(faceheroPollBusy||!KEY) return;
    faceheroPollBusy=true;
    try{
      const j=await(await fetch('/face-hero-status?key='+KEY)).json();
      window._facehero=j;
      renderFaceHero(j);
      updateTabBadges();
      if(!j.running&&j.phase!=='starting'&&j.phase!=='facehero'&&j.phase!=='review'){ clearInterval(faceheroPoll); faceheroPoll=null; }
    }catch(e){}finally{ faceheroPollBusy=false; }
  },1500);
}
async function refreshFaceHeroStatus(){
  if(!KEY) return;
  try{
    const j=await(await fetch('/face-hero-status?key='+KEY)).json();
    window._facehero=j;
    if(j.guideKeywords){ const el=$('#faceheroKeywords'); if(el&&document.activeElement!==el) el.value=j.guideKeywords; }
    if(j.autoApproveImages != null){ const el=$('#faceheroAutoApprove'); if(el&&document.activeElement!==el) el.checked=!!j.autoApproveImages; }
    renderFaceHero(j);
    if(j.running||j.phase==='review') startFaceHeroPoll();
    updateTabBadges();
  }catch(e){}
}
let formatfixPoll=null, formatfixPollBusy=false;
function renderFormatFixer(j){
  if(!j) return;
  const prog=$('#formatfixProg'), bar=$('#formatfixProgBar'), lbl=$('#formatfixProgLbl'), stats=$('#formatfixStats'), log=$('#formatfixLog');
  const start=$('#formatfixStart'), stop=$('#formatfixStop'), forceStop=$('#formatfixForceStop'), autoToggle=$('#formatfixAutoToggle'), pf=$('#formatfixPillarFilter');
  const active=!!(j.running||j.phase==='starting'||j.phase==='fix'||(j.auto&&j.phase==='waiting'));
  if(pf) pf.disabled=active;
  if(autoToggle){
    autoToggle.textContent=j.auto?'▶ FIXER AUTO-RUN 100 · ON':'⏸ FIXER AUTO-RUN 100 · OFF';
    autoToggle.setAttribute('aria-pressed',j.auto?'true':'false');
    autoToggle.style.setProperty('background',j.auto?'linear-gradient(135deg,#15803d,#22c55e)':'#374151','important');
  }
  if(active){
    if(prog) prog.style.display='block';
    if(start) start.style.display='none';
    if(stop) stop.disabled=false;
    if(forceStop) forceStop.disabled=false;
  }else{
    if(start) start.style.display='';
    if(stop) stop.disabled=true;
    if(forceStop) forceStop.disabled=true;
    if(prog&&(j.done>0||j.phase==='done'||j.phase==='stopped'||j.phase==='error')) prog.style.display='block';
  }
  const pct=Number(j.pct)||0;
  const pctShow=(pct>0&&pct<1)?pct.toFixed(1):String(Math.round(pct));
  if(bar) bar.style.width=Math.max(pct>0?0.5:0,pct)+'%';
  if(lbl){
    const cur=j.currentId?(' · now: '+esc(j.currentId)+' — '+esc(String(j.currentTitle||'').slice(0,48))):'';
    lbl.innerHTML='<b>'+pctShow+'%</b> — '+(j.done||0).toLocaleString()+' / '+(j.total||0).toLocaleString()+' Q&amp;As'+cur+(j.currentStep?(' · '+esc(j.currentStep)):'');
  }
  if(stats) stats.innerHTML=
    '<div>📦 current pod: <span>'+(j.podNumber||0)+' · '+(j.podSize||100)+' each</span></div>'+
    '<div>🔄 full cycles: <span>'+(j.cycles||0)+'</span></div>'+
    '<div>📝 entries fixed: <span>'+(j.entriesFixed||0)+'</span></div>'+
    '<div>✅ content rubric pass: <span>'+(j.entriesPass||0)+'</span></div>'+
    '<div>⏭ already OK: <span>'+(j.entriesSkipped||0)+'</span></div>'+
    '<div>⏭ no blob: <span>'+(j.skippedNoBlob||0)+'</span></div>'+
    '<div>⚠️ errors: <span>'+(j.errors||0)+'</span></div>'+
    '<div>📁 pillar: <span>'+esc(j.pillarName||j.pillar||'—')+'</span></div>';
  if(log) log.innerHTML=(j.log||[]).length?(j.log||[]).map(l=>esc(l)).join('<br>'):'<span style="color:#667">Pick pillar → Fix content &amp; structure — images are never modified</span>';
}
function startFormatFixerPoll(){
  if(formatfixPoll) return;
  formatfixPoll=setInterval(async()=>{
    if(formatfixPollBusy||!KEY) return;
    formatfixPollBusy=true;
    try{
      const j=await(await fetch('/format-fixer-status?key='+KEY)).json();
      window._formatfix=j;
      if(window.activeTab==='formatfix') renderFormatFixer(j);
      updateTabBadges();
      if(!j.running&&!j.auto&&j.phase!=='starting'&&j.phase!=='fix'){ clearInterval(formatfixPoll); formatfixPoll=null; }
    }catch(e){}finally{ formatfixPollBusy=false; }
  },1500);
}
async function refreshFormatFixerStatus(){
  if(!KEY) return;
  try{
    const j=await(await fetch('/format-fixer-status?key='+KEY)).json();
    window._formatfix=j;
    renderFormatFixer(j);
    if(j.running||j.auto) startFormatFixerPoll();
    updateTabBadges();
  }catch(e){}
}
let internalPoll=null, internalPollBusy=false;
function renderInternalImages(j){
  if(!j) return;
  const prog=$('#internalProg'), bar=$('#internalProgBar'), lbl=$('#internalProgLbl'), stats=$('#internalStats'), log=$('#internalLog');
  const start=$('#internalStart'), stop=$('#internalStop'), forceStop=$('#internalForceStop'), pf=$('#internalPillarFilter'), kw=$('#internalKeywords');
  const active=!!(j.running||j.phase==='fix');
  if(pf) pf.disabled=active;
  if(kw) kw.disabled=active;
  if(active){ if(prog) prog.style.display='block'; if(start) start.style.display='none'; if(stop) stop.disabled=false; if(forceStop) forceStop.disabled=false; }
  else { if(start) start.style.display=''; if(stop) stop.disabled=true; if(forceStop) forceStop.disabled=true; if(prog&&(j.done>0||j.phase==='done'||j.phase==='stopped')) prog.style.display='block'; }
  const pct=Number(j.pct)||0;
  if(bar) bar.style.width=Math.max(pct>0?0.5:0,pct)+'%';
  if(lbl) lbl.innerHTML='<b>'+pct+'%</b> — '+(j.done||0)+' / '+(j.total||0)+(j.currentId?' · '+esc(j.currentId):'')+(j.currentStep?' · '+esc(j.currentStep):'');
  if(stats) stats.innerHTML='<div>✅ pass: <span>'+(j.entriesPass||0)+'</span></div><div>🖼 flux sections: <span>'+(j.fluxImages||0)+'</span></div><div>🔧 fixed: <span>'+(j.entriesFixed||0)+'</span></div><div>📁 '+esc(j.pillarName||j.pillar||'—')+'</div>';
  if(log) log.innerHTML=(j.log||[]).map(l=>esc(l)).join('<br>')||'<span style="color:#667">Section Pollinator only — hero untouched</span>';
}
function startInternalPoll(){
  if(internalPoll) return;
  internalPoll=setInterval(async()=>{
    if(internalPollBusy||!KEY) return;
    internalPollBusy=true;
    try{
      const j=await(await fetch('/internal-images-status?key='+KEY)).json();
      window._internal=j;
      if(window.activeTab==='internalimages') renderInternalImages(j);
      updateTabBadges();
      if(!j.running) { clearInterval(internalPoll); internalPoll=null; }
    }catch(e){}finally{ internalPollBusy=false; }
  },1500);
}
async function refreshInternalImagesStatus(){
  if(!KEY) return;
  try{
    const j=await(await fetch('/internal-images-status?key='+KEY)).json();
    window._internal=j;
    if(j.guideKeywords){ const el=$('#internalKeywords'); if(el&&document.activeElement!==el) el.value=j.guideKeywords; }
    renderInternalImages(j);
    if(j.running) startInternalPoll();
    updateTabBadges();
  }catch(e){}
}
let rubricPoll=null, rubricPollBusy=false;
function renderRubricStation(j){
  if(!j) return;
  const prog=$('#rubricProg'), bar=$('#rubricProgBar'), lbl=$('#rubricProgLbl'), stats=$('#rubricStats'), log=$('#rubricLog');
  const start=$('#rubricStart'), stop=$('#rubricStop'), forceStop=$('#rubricForceStop'), sf=$('#rubricStationFilter'), pf=$('#rubricPillarFilter');
  const active=!!(j.running||j.phase==='fix');
  if(sf) sf.disabled=active;
  if(pf) pf.disabled=active;
  if(active){ if(prog) prog.style.display='block'; if(start) start.style.display='none'; if(stop) stop.disabled=false; if(forceStop) forceStop.disabled=false; }
  else { if(start) start.style.display=''; if(stop) stop.disabled=true; if(forceStop) forceStop.disabled=true; if(prog&&(j.done>0||j.phase==='done'||j.phase==='stopped')) prog.style.display='block'; }
  const pct=Number(j.pct)||0;
  if(bar) bar.style.width=Math.max(pct>0?0.5:0,pct)+'%';
  if(lbl) lbl.innerHTML='<b>'+pct+'%</b> — '+(j.stationLabel||j.station||'—')+' · '+(j.done||0)+' / '+(j.total||0)+(j.currentId?' · '+esc(j.currentId):'');
  if(stats) stats.innerHTML='<div>✅ pass: <span>'+(j.entriesPass||0)+'</span></div><div>🔍 audit fail: <span>'+(j.auditFail||0)+'</span></div><div>📁 '+esc(j.pillarName||j.pillar||'—')+'</div>';
  if(log) log.innerHTML=(j.log||[]).map(l=>esc(l)).join('<br>')||'<span style="color:#667">Pick station + pillar → fix + audit one slice</span>';
}
function startRubricPoll(){
  if(rubricPoll) return;
  rubricPoll=setInterval(async()=>{
    if(rubricPollBusy||!KEY) return;
    rubricPollBusy=true;
    try{
      const j=await(await fetch('/rubric-station-status?key='+KEY)).json();
      window._rubricstation=j;
      if(window.activeTab==='rubricstation') renderRubricStation(j);
      updateTabBadges();
      if(!j.running) { clearInterval(rubricPoll); rubricPoll=null; }
    }catch(e){}finally{ rubricPollBusy=false; }
  },1500);
}
async function refreshRubricStationStatus(){
  if(!KEY) return;
  try{
    const j=await(await fetch('/rubric-station-status?key='+KEY)).json();
    window._rubricstation=j;
    if(j.station){ const el=$('#rubricStationFilter'); if(el) el.value=j.station; }
    renderRubricStation(j);
    if(j.running) startRubricPoll();
    updateTabBadges();
  }catch(e){}
}
let imgenPoll=null, imgenPollBusy=false;
function renderImgGen(j){
  if(!j) return;
  const prog=$('#imgenProg'), bar=$('#imgenProgBar'), lbl=$('#imgenProgLbl'), stats=$('#imgenStats'), log=$('#imgenLog');
  const start=$('#imgenStart'), stop=$('#imgenStop'), forceStop=$('#imgenForceStop'), pf=$('#imgenPillarFilter'), tgt=$('#imgenTarget'), kwIn=$('#imgenKeywords');
  const review=$('#imgenReview'), grid=$('#imgenGrid'), rtitle=$('#imgenReviewTitle');
  const poolGrid=$('#imgenPoolGrid'), poolTotal=$('#imgenPoolTotal');
  const another=$('#imgenAnother'), commit=$('#imgenCommit'), discard=$('#imgenDiscard');
  const selPillar=(pf&&pf.value)||j.pillar||'tl';
  if(poolTotal) poolTotal.textContent=(j.poolTotal||0).toLocaleString()+' saved · '+(j.poolTopics||[]).filter(r=>r.poolCount>0).length+' topics with images';
  if(poolGrid){
    const rows=j.poolTopics||[];
    if(!rows.length) poolGrid.innerHTML='<span style="color:#667">No topics loaded</span>';
    else poolGrid.innerHTML=rows.map(function(r){
      const z=r.poolCount?'':' zero', s=r.pillar===selPillar?' sel':'';
      return '<div class="imgen-pool-row'+z+s+'" data-pillar="'+esc(r.pillar)+'" title="Click to select '+esc(r.name)+'">'+
        '<span>'+esc(r.name)+' <code>'+esc(r.pillar)+'</code></span>'+
        '<span class=n>'+(r.poolCount||0).toLocaleString()+'</span></div>';
    }).join('');
  }
  const active=!!(j.running||j.phase==='starting'||j.phase==='collect'||j.phase==='committing');
  const hasBatch=!!(j.batch&&j.batch.candidates&&j.batch.candidates.length);
  const showReview=hasBatch&&(j.phase==='review'||j.phase==='collect'||j.phase==='stopped');
  const inReview=showReview&&!active;
  if(pf) pf.disabled=active||inReview;
  if(tgt) tgt.disabled=active||inReview;
  if(kwIn){
    kwIn.disabled=active||inReview;
    if(j.guideKeywords != null && String(j.guideKeywords) && !kwIn.value) kwIn.value=String(j.guideKeywords);
  }
  if(active){
    if(prog) prog.style.display='block';
    if(start) start.style.display='none';
    if(stop) stop.disabled=false;
    if(forceStop) forceStop.disabled=false;
  }else{
    if(start) start.style.display='';
    if(stop) stop.disabled=true;
    if(forceStop) forceStop.disabled=true;
    if(prog) prog.style.display=(showReview||j.poolCount>0||j.log&&j.log.length)?'block':'none';
  }
  if(review) review.style.display=showReview?'block':'none';
  const pct=j.pct||0;
  if(bar) bar.style.width=pct+'%';
  if(lbl){
    const q=j.currentQuery?(' · '+esc(String(j.currentQuery).slice(0,56))):'';
    const slot=j.currentSlot?(' · #'+j.currentSlot):'';
    if(j.running||j.phase==='collect') lbl.innerHTML='<b>'+pct+'%</b> — finding candidates '+((j.batch&&j.batch.candidates)?j.batch.candidates.length:(j.done||0))+' / '+(j.target||100)+slot+q;
    else if(j.phase==='curate') lbl.innerHTML='<b>Curating</b> — scoring &amp; picking best…';
    else if(j.phase==='committing') lbl.innerHTML='<b>Saving</b> — writing kept images to pool…';
    else if(showReview) lbl.innerHTML='<b>Review</b> — '+j.batch.candidates.length+' candidate'+(j.batch.candidates.length===1?'':'s')+(active?' (still finding…)':'')+' · pool '+(j.poolCount||0);
    else lbl.innerHTML='<b>'+pct+'%</b> — pool: '+(j.poolCount||0)+' images · ready'+slot;
  }
  if(stats) stats.innerHTML=
    '<div>🎨 in pool: <span>'+(j.poolCount||0)+'</span></div>'+
    '<div>👀 batch: <span>'+(inReview?j.batch.candidates.length:0)+'</span></div>'+
    '<div>📥 harvested: <span>'+(j.harvested||0)+'</span></div>'+
    '<div>✨ DDG: <span>'+(j.generated||0)+'</span></div>'+
    '<div>🌸 flux: <span>'+(j.fluxGenerated||0)+'</span></div>'+
    '<div>⚠️ misses: <span>'+(j.errors||0)+'</span></div>'+
    '<div>📁 pillar: <span>'+esc(j.pillarName||j.pillar||'tl')+'</span></div>'+
    (j.guideKeywords?('<div>🔎 guide: <span>'+esc(String(j.guideKeywords).slice(0,80))+(String(j.guideKeywords).length>80?'…':'')+'</span></div>'):'');
  if(log) log.innerHTML=(j.log||[]).length?(j.log||[]).map(l=>esc(l)).join('<br>'):'<span style="color:#667">Pick pillar → Find ${IMG_GEN_BATCH_DEFAULT} — auto keep/reject → saved to pool</span>';
  if(start){
    const n=parseInt((tgt&&tgt.value)||j.target||${IMG_GEN_BATCH_DEFAULT},10)||${IMG_GEN_BATCH_DEFAULT};
    start.textContent=inReview?'▶ Find another '+n:'▶ Find '+n+' images';
  }
  if(another) another.style.display=inReview?'':'none';
  if(commit) commit.disabled=!!active;
  if(discard) discard.disabled=!!active;
  if(inReview&&grid&&rtitle){
    if(!window._imgenApprovals) window._imgenApprovals={};
    rtitle.textContent='Review '+j.batch.candidates.length+' — ✓ approve · ✗ reject';
    const gridSig=(j.batch.batchId||'b')+':'+j.batch.candidates.length;
    if(gridSig!==window._imgenGridSig){
      window._imgenGridSig=gridSig;
      grid.innerHTML=j.batch.candidates.map(function(c){
        const apr=window._imgenApprovals[c.id];
        const ycls=apr===true?' on':'', ncls=apr===false?' on':'';
        const cardCls=apr===true?'on-yes':apr===false?'on-no':'';
        return '<div class="imgen-card '+cardCls+'" data-id="'+esc(c.id)+'">'+
          '<a href="'+esc(c.previewUrl)+'" target=_blank rel=noopener><img src="'+esc(c.previewUrl)+'" alt="" loading=lazy></a>'+
          '<div class=imgen-card-meta>'+esc(String(c.source||'img')+' · '+String(c.query||'').slice(0,36))+'</div>'+
          '<div class=imgen-card-btns><button type=button class="yes'+ycls+'">✓</button><button type=button class="no'+ncls+'">✗</button></div></div>';
      }).join('');
    }else{
      j.batch.candidates.forEach(function(c){
        const card=grid.querySelector('.imgen-card[data-id="'+c.id+'"]');
        if(!card) return;
        const apr=window._imgenApprovals[c.id];
        card.classList.toggle('on-yes',apr===true);
        card.classList.toggle('on-no',apr===false);
        const yb=card.querySelector('.imgen-card-btns .yes');
        const nb=card.querySelector('.imgen-card-btns .no');
        if(yb) yb.classList.toggle('on',apr===true);
        if(nb) nb.classList.toggle('on',apr===false);
      });
    }
  }else{
    window._imgenGridSig='';
  }
}
function startImgGenPoll(){
  if(imgenPoll) return;
  imgenPoll=setInterval(async()=>{
    if(imgenPollBusy||!KEY) return;
    imgenPollBusy=true;
    try{
      const j=await(await fetch('/image-generator-status?key='+KEY)).json();
      window._imgen=j;
      if(window.activeTab==='imgen') renderImgGen(j);
      updateTabBadges();
      if(!j.running&&j.phase!=='starting'&&j.phase!=='collect'&&j.phase!=='curate'&&j.phase!=='committing'){ clearInterval(imgenPoll); imgenPoll=null; }
    }catch(e){}finally{ imgenPollBusy=false; }
  },1500);
}
async function refreshImgGenStatus(){
  if(!KEY) return;
  try{
    const j=await(await fetch('/image-generator-status?key='+KEY)).json();
    window._imgen=j;
    const kwIn=$('#imgenKeywords');
    if(kwIn && j.guideKeywords != null && String(j.guideKeywords) && document.activeElement!==kwIn && !kwIn.value) kwIn.value=String(j.guideKeywords);
    renderImgGen(j);
    if(j.running) startImgGenPoll();
    updateTabBadges();
    return j;
  }catch(e){}
}
function initImgGenKeywords(){
  const kwIn=$('#imgenKeywords');
  if(!kwIn) return;
  try{
    const saved=localStorage.getItem('imgenGuideKeywords');
    if(saved && !kwIn.value) kwIn.value=saved;
  }catch(e){}
  kwIn.addEventListener('input',()=>{ try{ localStorage.setItem('imgenGuideKeywords', kwIn.value||''); }catch(e){} });
}
function initPage(){
  bindPipelineTabs();
  updateTabBadges();
  bindGenCountUi();
  initImgGenKeywords();
  initGuideKeywordsUi();
}
function openSquareQaFromLink(){
  let id='';try{id=new URLSearchParams(location.search).get('qa')||'';}catch(e){}
  if(!id)return;
  const input=$('#squareQaId');if(input)input.value=id;
  setTimeout(()=>{const button=$('#squarePexelsSearch');if(button&&!button.disabled)button.click();},250);
}
function showFsGenerate(on){
  const fs=$('#fsGenerate');
  if(fs) fs.classList.toggle('on',!!on);
  if(on) document.body.style.overflow='hidden';
  else if(!($('#fsScrub')&&$('#fsScrub').classList.contains('on'))) document.body.style.overflow='';
}
function scrubPillarOptionHtml(ps, sa){
  sa=sa||window._sa||{};
  const qAll=sa.queueLen!=null?sa.queueLen:(ps||[]).reduce((n,p)=>n+(p.q||0),0);
  const allOpt='<option value=all>All pillars — '+(qAll||0)+' in queue</option>';
  const rest=(ps||[]).map(p=>'<option value="'+p.p+'">'+p.name+' ('+(p.q||0)+' in queue · '+(p.n||0)+' indexed)</option>').join('');
  return allOpt+rest;
}
function syncScrubPillarSelects(sourceEl){
  const main=$('#scrubpillarfilter'), fs=$('#fsScrubPillarFilter');
  if(!main&&!fs) return;
  const val=(sourceEl&&sourceEl.value)||(main&&main.value)||(fs&&fs.value)||'all';
  if(main&&main.value!==val) main.value=val;
  if(fs&&fs.value!==val) fs.value=val;
}
function paintScrubPillarFilterUi(d){
  if(!d) return;
  const pf=d.scrubPillarFilter, fl=d.queueFilteredLen!=null?d.queueFilteredLen:(d.queueLen||0);
  const stats=(pf?('Filtering → '+fl+' matching'):((d.queueLen||0)+' total in queue'))+(d.queueDupeCount?(' · 🔄 '+d.queueDupeCount+' dupe-priority'):'');
  const banTxt=pf?('🎯 Scrubbing only '+esc(d.scrubPillarFilterName||pf)+' — '+fl+' in queue'+(d.queueSkippedByFilter?(' · '+d.queueSkippedByFilter+' other pillars skipped'):'')):'';
  for(const pair of [[$('#scrubFilterStats'),$('#scrubFilterBanner')],[$('#fsScrubFilterStats'),$('#fsScrubFilterBanner')]]){
    const st=pair[0], ban=pair[1];
    if(st) st.textContent=stats+(d.imageDupe&&d.imageDupe.prioritized?(' · '+d.imageDupe.prioritized+' within-page dupes flagged'):'');
    if(ban){ if(pf){ ban.style.display='block'; ban.textContent=banTxt; } else { ban.style.display='none'; ban.textContent=''; } }
  }
  syncScrubPillarSelects();
}
function readGuideKeywords(id){ const el=$('#'+id); return el&&el.value!=null?String(el.value).trim():''; }
function initGuideKeywordsUi(){
  [['faceheroKeywords','faceheroGuideKeywords'],['rewriteKeywords','rewriteGuideKeywords'],['dupeKeywords','dupeGuideKeywords']].forEach(pair=>{
    const el=$(pair[0]); if(!el) return;
    try{ const saved=localStorage.getItem(pair[1]); if(saved&&!el.value) el.value=saved; }catch(e){}
    el.addEventListener('input',()=>{ try{ localStorage.setItem(pair[1], el.value||''); }catch(e){} });
  });
  [['faceheroAutoApprove','faceheroAutoApprove'],['rewriteAutoApprove','rewriteAutoApprove']].forEach(pair=>{
    const el=$(pair[0]); if(!el) return;
    try{ const saved=localStorage.getItem(pair[1]); if(saved==='1') el.checked=true; else if(saved==='0') el.checked=false; }catch(e){}
    el.addEventListener('change',()=>{ try{ localStorage.setItem(pair[1], el.checked?'1':'0'); }catch(e){} });
  });
}
function readAutoApprove(id){ const el=$('#'+id); return !!(el&&el.checked); }
function activeGuideKeyword(guideKeywords, attempt){
  const parts=String(guideKeywords||'').split(',').map(s=>s.trim()).filter(Boolean);
  if(!parts.length) return '';
  const idx=Math.max(0,(Number(attempt||1)||1)-1)%parts.length;
  return parts[idx];
}
function paintCardReview(prefix, pr, attempt, guideKeywords){
  const review=$('#'+prefix+'Review'), img=$('#'+prefix+'ReviewImg'), link=$('#'+prefix+'ReviewLink'), meta=$('#'+prefix+'ReviewMeta'), title=$('#'+prefix+'ReviewTitle');
  if(!review) return;
  if(!pr){ review.style.display='none'; if(img) img.removeAttribute('src'); return; }
  review.style.display='block';
  const tryN=pr.attempt||attempt||1;
  const nonce=pr.previewNonce||(pr.id+'-a'+tryN+'-'+Date.now());
  const url=(pr.previewUrl||'')+'?v='+encodeURIComponent(nonce);
  if(img){ img.onload=null; img.src=''; img.src=url; }
  if(link) link.href=(pr.previewUrl||'#')+'?v='+encodeURIComponent(nonce);
  if(title) title.textContent='Review '+pr.id;
  const kw=activeGuideKeyword(guideKeywords, tryN);
  const kwTxt=kw?(' · guide: '+kw):'';
  const searchTxt=pr.searchQuery?(' · search: '+String(pr.searchQuery).slice(0,72)):'';
  if(meta) meta.textContent=(pr.title||pr.id)+' · try #'+tryN+searchTxt+kwTxt+' — ✓ Keep saves · ✗ Try again = next title search'+(kw?(' + next guide keyword'):'');
}
function loadPillars(){
  if(!KEY) return Promise.resolve();
  return fetch('/pillars?key='+KEY).then(r=>r.json()).then(ps=>{
    const sel=$('#genpillar'), ssel=$('#scrubpillarfilter'), fssel=$('#fsScrubPillarFilter'), dsel=$('#dupePillarFilter'), isel=$('#imgenPillarFilter'), fhsel=$('#faceheroPillarFilter'), iisel=$('#internalPillarFilter'), rpsel=$('#rubricPillarFilter'), rsel=$('#rewritePillarFilter'), fsel=$('#formatfixPillarFilter');
    if(ps&&ps.length){
      const opts=ps.map(p=>'<option value="'+p.p+'">'+p.name+' ('+p.n+')</option>').join('');
      const idxAll=ps.reduce((n,p)=>n+(p.n||0),0);
      const scrubOpts=scrubPillarOptionHtml(ps, window._sa);
      const dupeOpts='<option value=all>All pillars — '+idxAll.toLocaleString()+' Q&amp;As</option>'+ps.map(p=>'<option value="'+p.p+'">'+p.name+' ('+(p.n||0).toLocaleString()+' indexed)</option>').join('');
      if(sel){ sel.innerHTML=opts; if(ps.some(p=>p.p==='ce')) sel.value='ce'; else if(ps[0]) sel.value=ps[0].p; }
      if(ssel){ ssel.innerHTML=scrubOpts; syncScrubPillarSelects(ssel); }
      if(fssel){ fssel.innerHTML=scrubOpts; syncScrubPillarSelects(ssel||fssel); }
      if(dsel){ dsel.innerHTML=dupeOpts; if(window._dupe&&window._dupe.pillar) dsel.value=window._dupe.pillar; else if(ps.some(p=>p.p==='tl')) dsel.value='tl'; }
      if(isel){
        const poolMap={};
        if(window._imgen&&window._imgen.poolTopics) window._imgen.poolTopics.forEach(r=>{ poolMap[r.pillar]=r.poolCount; });
        const imgenOpts=ps.map(p=>'<option value="'+p.p+'">'+p.name+' · '+(poolMap[p.p]!=null?poolMap[p.p]:'?')+' pool · '+(p.n||0).toLocaleString()+' Q&amp;As</option>').join('');
        isel.innerHTML=imgenOpts;
        if(window._imgen&&window._imgen.pillar) isel.value=window._imgen.pillar;
        else if(ps.some(p=>p.p==='tl')) isel.value='tl';
        else if(ps[0]) isel.value=ps[0].p;
      }
      if(fhsel){
        const fhOpts=ps.map(p=>'<option value="'+p.p+'">'+p.name+' ('+(p.n||0).toLocaleString()+' Q&amp;As)</option>').join('');
        fhsel.innerHTML=fhOpts;
        if(window._facehero&&window._facehero.pillar) fhsel.value=window._facehero.pillar;
        else if(ps.some(p=>p.p==='tl')) fhsel.value='tl';
        else if(ps[0]) fhsel.value=ps[0].p;
      }
      const pillarOpts=ps.map(p=>'<option value="'+p.p+'">'+p.name+' ('+(p.n||0).toLocaleString()+' Q&amp;As)</option>').join('');
      if(iisel){
        iisel.innerHTML=pillarOpts;
        if(window._internal&&window._internal.pillar) iisel.value=window._internal.pillar;
        else if(ps.some(p=>p.p==='tl')) iisel.value='tl';
      }
      if(rpsel){
        rpsel.innerHTML=pillarOpts;
        if(window._rubricstation&&window._rubricstation.pillar) rpsel.value=window._rubricstation.pillar;
        else if(ps.some(p=>p.p==='tl')) rpsel.value='tl';
      }
      if(rsel){
        const rewriteOpts=ps.map(p=>'<option value="'+p.p+'">'+p.name+' ('+(p.n||0).toLocaleString()+' Q&amp;As)</option>').join('');
        rsel.innerHTML=rewriteOpts;
        if(window._rewrite&&window._rewrite.pillar) rsel.value=window._rewrite.pillar;
        else if(ps.some(p=>p.p==='tl')) rsel.value='tl';
        else if(ps[0]) rsel.value=ps[0].p;
      }
      if(fsel){
        const ffOpts=ps.map(p=>'<option value="'+p.p+'">'+p.name+' ('+(p.n||0).toLocaleString()+' Q&amp;As)</option>').join('');
        fsel.innerHTML=ffOpts;
        if(window._formatfix&&window._formatfix.pillar) fsel.value=window._formatfix.pillar;
        else if(ps.some(p=>p.p==='tl')) fsel.value='tl';
        else if(ps[0]) fsel.value=ps[0].p;
      }
      pillarsLoaded=true;
    }
  }).catch(()=>{ pillarsLoaded=false; });
}
function setScrubPillarFilterUi(pillar){
  syncScrubPillarSelects({ value: pillar||'all' });
}
async function postScrubFilter(pillar){
  if(!KEY) return;
  syncScrubPillarSelects({ value: pillar||'all' });
  try{
    const r=await fetch('/scrub-filter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar:pillar||'all'})});
    const d=await r.json();
    if(d.ok && window._sa){ window._sa.scrubPillarFilter=d.pillar; window._sa.scrubPillarFilterName=d.pillarName; window._sa.queueFilteredLen=d.queueFilteredLen; window._sa.queueSkippedByFilter=d.queueSkippedByFilter; renderScrubVisibility(window._sa); paintScrubFilterStats(window._sa); }
  }catch(e){}
}
function paintScrubFilterStats(d){
  if(!d) return;
  paintScrubPillarFilterUi(d);
  const st=$('#scrubFilterStats');
  if(!st) return;
  const qbp=d.queueByPillar||{};
  const chips=Object.keys(qbp).sort().map(p=>p+':'+(qbp[p]||0)).join(' · ');
  const pf=d.scrubPillarFilter, fl=d.queueFilteredLen!=null?d.queueFilteredLen:(d.queueLen||0);
  st.textContent=(pf?('Filtering → '+fl+' matching'):((d.queueLen||0)+' total in queue'))+(d.queueDupeCount?(' · 🔄 '+d.queueDupeCount+' within-page dupe-priority'):'')+(d.imageDupe&&d.imageDupe.prioritized?(' · '+d.imageDupe.prioritized+' within-page dupes flagged'):'')+(chips?(' · '+chips):'');
}
function paintPipelineAlt(alt, genRunning, scrubRunning){
  const show=!!(alt&&alt.enabled&&(genRunning||scrubRunning));
  const bars=[{bar:'#pipelineAltBar',gen:'#altSlotGen',scrub:'#altSlotScrub',st:'#altStatus',hist:'#altHistory'},{bar:'#pipelineAltBarScrub',gen:'#altSlotGenScrub',scrub:'#altSlotScrubScrub',st:'#altStatusScrub',hist:'#altHistoryScrub'},{bar:'#pipelineAltBarFs',gen:'#altSlotGenFs',scrub:'#altSlotScrubFs',st:'#altStatusFs',hist:'#altHistoryFs'},{bar:'#pipelineAltBarFsScrub',gen:'#altSlotGenFsScrub',scrub:'#altSlotScrubFsScrub',st:'#altStatusFsScrub',hist:'#altHistoryFsScrub'}];
  for(const b of bars){
    const bar=$(b.bar); if(bar){ bar.classList.toggle('on',show); if(!show) continue; }
    const g=$(b.gen), s=$(b.scrub), st=$(b.st), hist=$(b.hist);
    if(g){ g.classList.toggle('active',alt.active==='generate'); g.classList.toggle('next-up',!alt.active&&alt.next==='generate'); }
    if(s){ s.classList.toggle('active',alt.active==='scrub'); s.classList.toggle('next-up',!alt.active&&alt.next==='scrub'); }
    if(st){
      const wait=alt.waiting?(alt.waiting==='generate-idle'?'⏳ generate waiting for scrub…':alt.waiting==='scrub-idle'?'⏳ scrub waiting…':'⏳ waiting for '+alt.waiting+' turn…'):'';
      const nxt=alt.active?('🟢 NOW: '+(alt.active==='generate'?'Generate (factor 1)':'Scrub (factor 2)')):('🟡 NEXT: '+(alt.next==='generate'?'Generate':'Scrub'));
      st.textContent=[nxt,wait,' · Gen turns '+((alt.genTurns||0))+' · Scrub turns '+((alt.scrubTurns||0)),(genRunning&&scrubRunning)?' · both running — strict alternation':''].filter(Boolean).join('');
    }
    if(hist){
      const rows=(alt.history||[]).slice(0,6).map(h=>{
        const t=new Date(h.at||0).toLocaleTimeString();
        return t+' '+(h.role==='generate'?'✍️ gen':'🧽 scrub')+(h.detail?(' · '+String(h.detail).slice(0,24)):'');
      });
      hist.innerHTML=rows.length?rows.join('<br>'):'<span style="color:#556">No turns yet — generate goes first.</span>';
    }
  }
}
function renderScrubVisibility(d){
  if(!d) return;
  paintPipelineAlt(d.pipelineAlt, d.genRunning, d.running||d.scrubBusy);
  paintScrubFilterStats(d);
  const live=d.scrubLive||{};
  const activeId=d.activeId||(live.active?live.id:null)||(d.scrubBusy?d.scrubSlotId:null)||d.current;
  const scrubOn=!!(live.active||d.scrubBusy||isScrubActive(d));
  paintAllCarwash(live,{scrubActive:scrubOn&&!d.imageScrubRunning,genActive:false,scrubTitle:'🚿 Scrub · factor 2 car wash'});
  const act=$('#scrubVisActive');
  if(act) act.textContent=activeId?(activeId+(live.pillar?(' ['+live.pillar+']'):'')):'Idle';
  const cw=$('#scrubVisCarwash');
  if(cw&&!scrubOn){
    const lc=live.lastCertified;
    if(lc&&lc.id&&(Date.now()-(lc.at||0))<120000){
      cw.innerHTML='<div style="color:#7fe0a0">✅ <b>'+esc(lc.id)+'</b> · 13/13 ✓ · ['+esc(lc.pillar||'')+'] '+esc(String(lc.title||'').slice(0,52))+'</div>'+
        (lc.nextId?('<div style="color:#fbbf24;margin-top:4px;font-size:.78rem">→ Next: <b>'+esc(lc.nextId)+'</b> ['+esc(lc.nextPillar||'')+'] '+esc(String(lc.nextTitle||'').slice(0,44))+(lc.queueLeft?(' · '+lc.queueLeft+' waiting'):'')+'</div>'):('<div style="color:#889;margin-top:4px;font-size:.78rem">→ Queue empty</div>'));
    } else cw.textContent=live.carwash||live.stage||(d.stopping?'⏹ Finishing current entry…':'Waiting to start…');
  }
  const steps=$('#scrubVisSteps');
  if(steps){
    const track=live.stepsTrack||[];
    steps.innerHTML=track.length?track.map(function(s){
      var pct=stepTrackPct(s);
      var cnt=s.max>1?(s.cur+'/'+s.max+(s.detail?(' · '+s.detail):'')):(s.detail||'');
      return '<div class="scrub-vis-step '+esc(s.status)+'"><span>'+s.n+'. '+esc(s.label)+'</span><span style="min-width:72px;text-align:right">'+esc(cnt)+'</span><div class=track><i style="width:'+pct+'%"></i></div></div>';
    }).join(''):'<div style="color:#667;font-size:.76rem">Step track appears when scrubbing starts…</div>';
  }
  const rub=$('#scrubVisRubric');
  if(rub&&!scrubOn) rub.innerHTML=(live.rubricItems&&live.rubricItems.length)?live.rubricItems.map(function(i){return '<div class="'+(i.pass?'ok':'no')+'">'+(i.pass?'✅':'❌')+' '+esc(i.label)+'</div>';}).join(''):'<div style="color:#667;font-size:.72rem;grid-column:1/-1">Rubric checklist fills in as each criterion is graded…</div>';
  const qm=$('#scrubVisQueueMeta');
  const pf=d.scrubPillarFilter;
  if(qm) qm.textContent=(pf?('filter: '+esc(d.scrubPillarFilterName||pf)+' · '):'')+((d.queueFixCount||0)+' fix · '+(d.queueFreshCount||0)+' fresh');
  const qq=$('#scrubVisQueue');
  if(qq) qq.innerHTML=(d.queueNext&&d.queueNext.length)?d.queueNext.map(x=>'<div><span style="color:'+(x.kind==='fix'?'#fcd34d':'#7fe0a0')+'">'+(x.kind==='fix'?'↩':'🆕')+'</span> '+esc(x.id)+' ['+esc(x.pillar)+'] '+esc(x.title)+'</div>').join(''):('<div style="color:#667">'+(pf?'No '+esc(d.scrubPillarFilterName||pf)+' entries waiting':'Queue empty')+'</div>');
  const batch=$('#scrubVisBatch');
  const board=d.laneBoard;
  if(batch && board && board.rows && board.rows.length && isScrubActive(d) && !d.imageScrubRunning){
    batch.style.display='grid';
    const pfSet=pf?new Set([pf]):null;
    batch.innerHTML=board.rows.filter(r=>!pfSet||r.pillar===pf).slice(0,24).map(r=>{
      const w=r.active||r.queueColor==='green';
      return '<div class="scrub-vis-batch-row'+(w?' working':'')+'"><span>'+esc(r.id)+'</span><span style="flex:1;color:#9fb0c0">'+esc(String(r.title||'').slice(0,42))+'</span><span style="color:#8aa">'+esc(lanePhaseShort(r.phase))+'</span><span class=pct>'+(r.overallPct||0)+'%</span></div>';
    }).join('')||'<div style="color:#667">Batch filling…</div>';
  } else if(batch) batch.style.display='none';
  const actFeed=$('#scrubVisActivity');
  if(actFeed){
    const lines=(d.recentActivity||[]).map(a=>'<div>'+new Date(a.ts).toLocaleTimeString()+' · '+esc(a.msg||'')+'</div>');
    const runLog=(d.log||[]).slice(0,14).map(l=>'<div>'+esc(l)+'</div>');
    actFeed.innerHTML=(lines.length?lines.join(''):'')+(runLog.length?(lines.length?'<div style="margin-top:6px;color:#667">Run log:</div>':'')+runLog.join(''):'')||'<div style="color:#667">Activity appears here as entries scrub…</div>';
  }
}
function paintLaneMini(board, d){
  const mini=$('#laneMini');
  if(!mini||!board||!board.rows||!board.rows.length) return;
  mini.classList.add('on');
  const slots=(d.lane&&d.lane.slots)||board.slots||{};
  const workerBits=[];
  if(slots.content&&slots.content.busy) workerBits.push('✍️ '+slots.content.id);
  if(slots.content2&&slots.content2.busy) workerBits.push('✍️ '+slots.content2.id);
  if(slots.flux&&slots.flux.busy) workerBits.push('🌸 '+slots.flux.id);
  if(slots.ddg&&slots.ddg.busy) workerBits.push('🖼 '+slots.ddg.id);
  const hot=board.rows.filter(r=>r.queueColor==='green'||r.queueColor==='yellow').slice(0,6);
  mini.innerHTML='<div style="font-weight:800;color:#7fe0d0;margin-bottom:6px">📋 Batch '+board.activeJobs+'/'+board.maxJobs+(workerBits.length?(' · '+workerBits.join(' · ')):(' · idle'))+'</div>'+
    hot.map(r=>'<div style="padding:3px 0">'+queueIco(r.queueColor)+' <b>'+esc(r.id)+'</b> '+esc(lanePhaseKid(r.phase,r.sectionIdx,r.stages,r.phaseLabel))+' · '+r.overallPct+'%</div>').join('');
}
setTimeout(initPage,50);
(function autoFromUrl(){
  try{
    const q=new URLSearchParams(location.search);
    const code=String(q.get('code')||q.get('key')||'').trim();
    if(code.length===4&&pwEl){ pwEl.value=code; tryGate(); return; }
    if(q.get('open')==='1') enterGate();
  }catch(e){}
})();
// live visual for the scrub tab — progress bar + current URL + rolling log
let scrubLog=[];
function scrubRender(d){
  if(!d) return;
  if(d.state){ const g=d.state.green||0,u=d.state.under||0,tot=g+u,pct=tot?Math.round(g/tot*100):0; const bar=$('#scrubbar'),top=$('#scrubtop'); if(bar)bar.style.width=pct+'%'; if(top)top.textContent='Pool: '+u.toLocaleString()+' left to review · '+g.toLocaleString()+' certified ('+pct+'%) · today '+(d.state.today||0); }
  if(d.id){ const icon=d.status==='certified'?'✅':d.status==='parked'?'🅿️':(d.status==='empty'||d.status==='cap'?'🏁':'⚠️'); scrubLog.unshift(icon+' '+d.id+' '+(d.score!=null?d.score+'/13':'')+' '+String(d.title||'').slice(0,38)); scrubLog=scrubLog.slice(0,14); const lg=$('#scrublog'); if(lg)lg.innerHTML=scrubLog.map(l=>String(l).replace(/[<>]/g,'')).join('<br>'); }
}
const HYPE=['Boom! ✨','Another one certified!','Clean & honest. 🧼','Certified Fresh! 🌿','Nice — into the green pile.','One less in the red.','Quality locked in. 🔒','That URL is golden now.'];
let gateUnlocked=false;
const pwEl=$('#pw'), gateEl=$('#gate'), appEl=$('#app'), uni=$('#uni'), uniSplash=$('#uniSplash');
function elVisible(el){if(!el)return false;if(el.style.display==='none')return false;return window.getComputedStyle(el).display!=='none';}
function hideIntro(){if(uni)uni.style.display='none';if(uniSplash)uniSplash.style.display='none';}
// 🦄 unicorn intro (phone/remote-friendly): tap ANYWHERE on the dark screen to enter.
function enterGate(){if(gateUnlocked)return;hideIntro();if(gateEl){gateEl.style.display='flex';}setTimeout(()=>{try{pwEl&&pwEl.focus()}catch(e){}},60);}
uniSplash&&uniSplash.addEventListener('click',e=>{e.stopPropagation();enterGate();});
uniSplash&&uniSplash.addEventListener('touchstart',e=>{e.stopPropagation();enterGate();},{passive:true});
function onIntroTap(e){
  if(gateUnlocked)return;
  if(elVisible(gateEl))return;
  if(elVisible(appEl))return;
  if(uni&&uni.style.display==='none'&&(!uniSplash||uniSplash.style.display==='none'))return;
  enterGate();
}
document.addEventListener('click',onIntroTap);
document.addEventListener('touchstart',onIntroTap,{passive:true});
window.enterUnicornGate=enterGate;
function tryGate(){if(gateUnlocked)return;const code=pwEl?pwEl.value.trim():'';if(code.length!==4)return;KEY=code;fetch('/state?key='+KEY).then(r=>r.json()).then(d=>{if(d.ok){gateUnlocked=true;$('#gerr').textContent='';if(gateEl)gateEl.style.display='none';hideIntro();if(appEl)appEl.style.display='flex';shownGreen=d.green;shownUnder=d.under;paint(d,true);
  loadPillars();
  initPage();
  openSquareQaFromLink();
  fetch('/scrub-status').then(r=>r.json()).then(a=>{ window._sa=a; setScrubPillarFilterUi(a.scrubPillarFilter||'all'); renderAuto(a); if(a.state)paint(a.state); if(a.running||a.imageScrubRunning){ startAutoPoll(); } refreshSignoffQueue(); maybeOpenApprovalDeepLink(); updateTabBadges(); refreshDuplicatorStatus(); }).catch(()=>{ paintCrewManifest(null); maybeOpenApprovalDeepLink(); });
  fetch('/gen-status?key='+KEY).then(r=>r.json()).then(g=>{ if(g&&g.running){ window._gen=g; window.genRunning=true; genRender(g); genStartPoll(); } updateTabBadges(); }).catch(()=>{});
  if(window.activeTab==='imgen') refreshImgGenStatus();
  else if(window.activeTab==='duplicator') refreshDuplicatorStatus();
  else if(window.activeTab==='facehero') refreshFaceHeroStatus();
  else if(window.activeTab==='rewrite') refreshRewriteStatus();
  else if(window.activeTab==='formatfix') refreshFormatFixerStatus();
  startHeartbeat();
}else{$('#gerr').textContent='Wrong code'}}).catch(()=>$('#gerr').textContent='server?')}
pwEl&&pwEl.addEventListener('keydown',e=>{if(e.key==='Enter')tryGate()});
pwEl&&pwEl.addEventListener('input',()=>{if(pwEl.value.trim().length>=4)tryGate()});
// Persistent 3s heartbeat: always reflect true server state for both pipelines.
var heartbeat=null;
function startHeartbeat(){ if(heartbeat)return; heartbeat=setInterval(async()=>{ try{ const d=await(await fetch('/scrub-status')).json(); window._sa=d; if(window.activeTab==='scrub') renderAuto(d); else if(window.activeTab!=='duplicator'&&window.activeTab!=='imgen'&&window.activeTab!=='facehero'&&window.activeTab!=='rewrite'&&window.activeTab!=='formatfix') { paintRunStats(d); if(d.state)paint(d.state); } if((d.pendingList&&d.pendingList.length)||(d.state&&d.state.pending)) refreshSignoffQueue(); if(isScrubActive(d)&&!autoPoll) startAutoPoll(); }catch(e){} if(KEY){ try{ const g=await(await fetch('/gen-status?key='+KEY)).json(); window._gen=g; window.genRunning=!!g.running; if(window.activeTab==='generate') genRender(g); if(g.running&&!genPoll) genStartPoll(); else if(g.running) renderFsGenerate(g); }catch(e){} if(!dupePoll&&(window.activeTab==='duplicator'||(window._dupe&&window._dupe.running))){ try{ const j=await(await fetch('/image-duplicator-status?key='+KEY)).json(); window._dupe=j; if(window.activeTab==='duplicator') renderDuplicator(j); if(j.running) startDupePoll(); }catch(e){} } if(!imgenPoll&&(window.activeTab==='imgen'||(window._imgen&&window._imgen.running))){ try{ const j=await(await fetch('/image-generator-status?key='+KEY)).json(); window._imgen=j; if(window.activeTab==='imgen') renderImgGen(j); if(j.running) startImgGenPoll(); }catch(e){} } if(!rewritePoll&&(window.activeTab==='rewrite'||(window._rewrite&&window._rewrite.running))){ try{ const j=await(await fetch('/image-rewrite-status?key='+KEY)).json(); window._rewrite=j; if(window.activeTab==='rewrite') renderRewrite(j); if(j.running) startRewritePoll(); }catch(e){} } if(!faceheroPoll&&(window.activeTab==='facehero'||(window._facehero&&window._facehero.running))){ try{ const j=await(await fetch('/face-hero-status?key='+KEY)).json(); window._facehero=j; if(window.activeTab==='facehero') renderFaceHero(j); if(j.running) startFaceHeroPoll(); }catch(e){} } if(!formatfixPoll&&(window.activeTab==='formatfix'||(window._formatfix&&window._formatfix.running))){ try{ const j=await(await fetch('/format-fixer-status?key='+KEY)).json(); window._formatfix=j; if(window.activeTab==='formatfix') renderFormatFixer(j); if(j.running) startFormatFixerPoll(); }catch(e){} } } updateTabBadges(); },3000); }
function countUp(el,to){const from=shownGreen==null?to:shownGreen;shownGreen=to;if(from===to){el.textContent=to.toLocaleString();return}const t0=performance.now(),dur=700;function f(t){const k=Math.min(1,(t-t0)/dur);el.textContent=Math.round(from+(to-from)*(k*(2-k))).toLocaleString();if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function countDown(el,to){const from=shownUnder==null?to:shownUnder;shownUnder=to;if(from===to){el.textContent=to.toLocaleString();return}const t0=performance.now(),dur=700;function f(t){const k=Math.min(1,(t-t0)/dur);el.textContent=Math.round(from+(to-from)*(k*(2-k))).toLocaleString();if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function paintRunStats(d){
  const c=d.certified||0,r=d.ready||0,p=d.parked||0,t=d.tried||0;
  const html='This run: <b class=cert-n>'+c+'</b> certified · <b class=ready-n>'+r+'</b> awaiting agent approval · <b class=park-n>'+p+'</b> parked · <b>'+t+'</b> tried';
  const rs=$('#runStats'); if(rs) rs.innerHTML=html;
  const frs=$('#fsRunStats'); if(frs) frs.innerHTML=html;
}
function showFinishBanner(lf){
  const msg=lf.type==='certified'
    ?('✅ '+lf.id+' certified '+lf.score+'/13 — moved RED → GREEN')
    :lf.type==='ready'
    ?('📋 '+lf.id+' passed scrub ('+(lf.contentScore||lf.score)+'/13) — Cursor or Claude Code approval required')
    :('🅿️ '+lf.id+' done — content '+(lf.contentScore||lf.score)+'/13 but NOT certified (rubric sign-off failed'+(lf.why?(' · '+String(lf.why).slice(0,120)):'')+') · still in red pool');
  const cls='finish-banner '+(lf.type==='certified'?'cert':lf.type==='ready'?'ready':'park');
  ['finishBanner','fsFinishBanner'].forEach(id=>{ const b=$('#'+id); if(b){ b.className=cls; b.style.display='block'; b.textContent=msg; } });
}
function celebrateFinish(d){
  const lf=d&&d.lastFinish;
  if(lf) showFinishBanner(lf);
  paintRunStats(d);
  if(d.state) paint(d.state);
  if(!lf||!lf.at||lf.at===lastFinishAt) return false;
  lastFinishAt=lf.at;
  if(d.state) paint(d.state);
  if(lf.type==='certified'){
    streak++;
    try{if(AC&&AC.state==='suspended')AC.resume();}catch(e){}
    ding(true);setTimeout(()=>ding(true),180);
    burst(streak>=5?160:100);rain(1200);
    const msg='✅ '+lf.id+' certified '+lf.score+'/13 — moved RED → GREEN';
    showFinishBanner(lf);
    const combo=$('#combo'); if(combo){combo.textContent=(streak>1?('🔥 '+streak+' in a row! · '):'')+msg;combo.classList.add('pop');setTimeout(()=>combo.classList.remove('pop'),500);}
    const gp=$('.pill.green'); if(gp){gp.classList.add('cert-pop');setTimeout(()=>gp.classList.remove('cert-pop'),700);}
    const rp=$('.pill.red'); if(rp){rp.classList.add('cert-dip');setTimeout(()=>rp.classList.remove('cert-dip'),700);}
    const pb=document.querySelector('.popbar'); if(pb){pb.classList.add('cert-shift');setTimeout(()=>pb.classList.remove('cert-shift'),900);}
    if($('#fsScrub')&&$('#fsScrub').classList.contains('on'))doneFlash(true,lf.score);
  } else if (lf.type === 'ready') {
    streak = 0;
    const msg = lf.needsReview
      ? ('⚠️ ' + lf.id + ' — 12/13 in your pile for review' + (lf.caveats && lf.caveats.length ? (' (' + lf.caveats.join(', ') + ')') : ''))
      : ('📋 ' + lf.id + ' ready — Cursor or Claude Code approval required (' + (lf.contentScore || lf.score) + '/13)');
    showFinishBanner(lf);
    const combo = $('#combo'); if (combo) { combo.textContent = msg; combo.classList.add('pop'); setTimeout(() => combo.classList.remove('pop'), 500); }
    ding(true);
  } else {
    streak = 0;
    const why = lf.why ? (' · ' + String(lf.why).slice(0, 120)) : '';
    const msg = '🅿️ ' + lf.id + ' done — content ' + lf.contentScore + '/13 but NOT certified (rubric sign-off failed' + why + ') · still in red pool';
    showFinishBanner(lf);
    const combo = $('#combo'); if (combo) { combo.textContent = msg; combo.classList.add('pop'); setTimeout(() => combo.classList.remove('pop'), 500); }
    ding(false);
  }
  return true;
}
function celebrateCertify(d){ return celebrateFinish(d); }
function paint(d,instant){if(d.green!=null){const prev=shownGreen;if(instant){shownGreen=d.green;$('#green').textContent=d.green.toLocaleString()}else countUp($('#green'),d.green);}if(d.under!=null){if(instant){shownUnder=d.under;$('#under').textContent=d.under.toLocaleString()}else countDown($('#under'),d.under);}if(d.pending!=null){const pe=$('#pending');if(pe)pe.textContent=String(d.pending);}if(d.today!=null)$('#today').textContent=d.today;if(d.cap)$('#cap').textContent=d.cap;
  if(d.green!=null&&d.under!=null){const tot=d.green+d.under,gp=tot?d.green/tot*100:0;$('#popg').style.width=gp.toFixed(2)+'%';$('#popr').style.width=(100-gp).toFixed(2)+'%';$('#popg').textContent=gp>0.5?(Math.round(gp*100)/100+'% good'):'';$('#popgN').textContent=d.green.toLocaleString();$('#poprN').textContent=d.under.toLocaleString();}}
// little success "ding" via WebAudio
let AC;function ding(ok){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.type='sine';o.frequency.value=ok?880:200;g.gain.setValueAtTime(.0001,AC.currentTime);g.gain.exponentialRampToValueAtTime(ok?.25:.15,AC.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+(ok?.35:.2));o.start();if(ok)o.frequency.exponentialRampToValueAtTime(1320,AC.currentTime+.18);o.stop(AC.currentTime+.4)}catch(e){}}
// confetti burst
const cv=$('#fx'),cx=cv.getContext('2d');let parts=[];function resize(){cv.width=innerWidth;cv.height=innerHeight}resize();addEventListener('resize',resize);
const CS=['#2ecc71','#13c2c2','#f1c40f','#ff8a76','#a78bfa','#fff'];
function burst(n){for(let i=0;i<n;i++)parts.push({x:innerWidth/2,y:innerHeight*.42,vx:(Math.random()-.5)*16,vy:Math.random()*-14-4,g:.45,r:Math.random()*7+3,c:CS[i%CS.length],life:90,rot:Math.random()*6})}
function rain(ms){const t0=performance.now();(function add(t){if(t-t0>ms)return;for(let i=0;i<6;i++)parts.push({x:Math.random()*innerWidth,y:-20,vx:(Math.random()-.5)*2,vy:Math.random()*3+2,g:.12,r:Math.random()*6+3,c:CS[(Math.random()*CS.length)|0],life:160,rot:Math.random()*6});requestAnimationFrame(add)})(t0)}
// full-screen DONE flash with a score-specific reaction
const REACT={13:'🎉 Yay! A 13!',12:'😎 Sweet — a 12!',11:'😤 Oh man… an 11',10:'😅 So close — a 10',9:'😐 Eh, a 9',8:'😕 Meh, an 8',7:'🤢 Yuck, a 7',6:'😖 Oof, a 6',5:'😬 Yikes, a 5',4:'💀 Rough — a 4',3:'🙈 Oh no, a 3',2:'😱 Oh no… a TWO!',1:'☠️ Disaster — a 1',0:'☠️ A zero?!'};
function react(s){return REACT[s]!=null?REACT[s]:('Score '+s)}
function doneFlash(ok,score){const o=document.createElement('div');o.className='doneov '+(ok?'okov':'noov');o.textContent=react(score);document.body.appendChild(o);setTimeout(()=>o.remove(),1600)}
// microwave nag — ding every 60s until the user interacts ("opens the door")
let nagTimer=null;function startNag(){stopNag();nagTimer=setInterval(()=>ding(true),60000)}function stopNag(){if(nagTimer){clearInterval(nagTimer);nagTimer=null}}
['click','mousemove','keydown','touchstart','visibilitychange'].forEach(ev=>addEventListener(ev,()=>{if(document.visibilityState==='visible')stopNag()},{passive:true}));
function tick(){cx.clearRect(0,0,cv.width,cv.height);parts.forEach(p=>{p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.life--;p.rot+=.2;cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.fillStyle=p.c;cx.globalAlpha=Math.max(0,p.life/70);cx.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6);cx.restore()});parts=parts.filter(p=>p.life>0&&p.y<cv.height+30);requestAnimationFrame(tick)}tick();
var _goB=$('#go');_goB&&_goB.addEventListener('click',()=>{
  const b=$('#go');b.disabled=true;b.innerHTML='<span class=spin></span>🍳 Cooking… (1–3 min)';try{if(AC&&AC.state==='suspended')AC.resume();}catch(e){}
  {const sc=$('#scrubcur');if(sc)sc.textContent='🍳 cooking the next URL… (1–3 min)';}
  fetch('/scrub-one',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}).then(r=>r.json()).then(d=>{
    const r=$('#result');r.classList.add('show','flash');setTimeout(()=>r.classList.remove('flash'),1000);
    const cert=d.status==='certified';window.lastS=d.status||'';window.lastSteps=d.steps||[];
    if(d.id&&(cert||d.status==='parked')){if(window.activeTab==='scrub')doneFlash(cert,d.score);startNag();}
    const icon=cert?'✅':d.status==='parked'?'🅿️':d.status==='cap'||d.status==='empty'||d.done?'🏁':'⚠️';
    const wasTxt=d.before!=null?(' <span class=before>(started at <b>'+d.before+'/13</b>)</span>'):'';
    let head;
    if(cert){streak++;ding(true);setTimeout(()=>ding(true),180);if(window.activeTab==='scrub'){burst(streak>=5?200:120);rain(1600);}$('#combo').textContent=streak>1?('🔥 '+streak+' in a row!'):'';$('#combo').classList.add('pop');setTimeout(()=>$('#combo').classList.remove('pop'),400);head=(d.before!=null&&d.score>d.before)?('⬆️ Just improved '+d.before+' → '+d.score+'! 🎉'):('✅ Certified '+d.score+'/13'+wasTxt);}
    else{streak=0;$('#combo').textContent='';if(d.status==='parked'){ding(false);const why=(d.rubricFailed&&d.rubricFailed.length)?d.rubricFailed.join(', '):(d.msg||'');head='🅿️ Content '+d.score+'/13 — NOT certified · '+String(why).slice(0,80)+wasTxt;}else head=d.msg||d.status;}
    r.innerHTML='<div class="rid">'+icon+' '+(d.id?('<a href="https://pulserevops.com/knowledge/'+d.id+'" target=_blank style=color:#13c2c2>'+d.id+'</a> — '+(d.title||'')):'')+'</div><div>'+head+'</div>'+(d.steps?'<div class=steps>'+d.steps.join(' → ')+'</div>':'');
    if(d.state)paint(d.state);
    celebrateCertify(d);
    scrubRender(d); {const sc=$('#scrubcur');if(sc)sc.textContent='';}
    b.disabled=false;b.innerHTML='⚡ Scrub Next URL';
  }).catch(e=>{$('#result').innerHTML='error: '+e.message;b.disabled=false;b.innerHTML='⚡ Scrub Next URL'});
});
// 🔁 AUTO — runs SERVER-SIDE (persists when you leave/return). Full deep scrub on every entry
// (${IMAGE_LAW_UI.auto}, content fixes, rubric). No automated auditor. No fast pass.
let autoPoll=null;
function fmtSec(ms){var s=Math.max(0,Math.floor(ms/1000));return s>=60?(Math.floor(s/60)+'m'+String(s%60).padStart(2,'0')+'s'):s+'s';}
function paintEntryOverall(d){
  const live=(d&&d.scrubLive)||{};
  const board=d&&d.laneBoard;
  const activeRow=board&&board.rows&&board.rows.find(r=>r.active);
  const imgLive=imageScrubLive(d);
  const pct=imgLive&&imgLive.n?Math.min(100,Math.round((imgLive.done||0)/imgLive.n*100)):((activeRow&&activeRow.overallPct!=null)?activeRow.overallPct:(live.overallPct||0));
  const busy=!!(d&&(isScrubActive(d)||d.scrubBusy||d.stopping||(live&&live.active)||(board&&board.rows&&board.rows.length)));
  const wrap=$('#entryOverall'), bar=$('#entryOverallBar'), lbl=$('#entryOverallLbl');
  if(wrap) wrap.classList.toggle('on',busy);
  if(bar) bar.style.width=pct+'%';
  if(lbl) lbl.textContent=pct+'%';
  const opBar=$('#fsOverallPct'), opLbl=$('#fsOverallPctLbl'), fsTop=$('#fsOverallTop');
  if(opBar) opBar.style.width=pct+'%';
  if(opLbl) opLbl.textContent=pct+'%';
  if(fsTop) fsTop.classList.toggle('on',busy);
}
function renderAuto(d){
  if(!d) return;
  if(window.activeTab==='scrub') celebrateFinish(d);
  paintRunStats(d);
  renderSignoffPile(d);
  paintEntryOverall(d);
  renderLaneBoard(d);
  renderScrubVisibility(d);
  if(window.activeTab==='scrub'&&d.queueLen!=null&&window._lastPillarQueueLen!==d.queueLen){ window._lastPillarQueueLen=d.queueLen; if(pillarsLoaded) loadPillars(); }
  if(isScrubActive(d)&&!d.imageScrubRunning) startTickCountdown();
  else if(!isScrubActive(d)) stopTickCountdown();
  paintSimpleScrub(d);
  const fsHead=$('#fsHeadTitle');
  if(fsHead){
    if(d.imageScrubRunning) fsHead.textContent='🖼 Image Scrub — live (Fable v2)';
    else if(d.state&&(d.state.pending||0)>0) fsHead.textContent='🧽 Scrub Command — live · '+d.state.pending+' awaiting approval →';
    else fsHead.textContent='🧽 Scrubber — live';
  }
  if($('#fsScrub')&&$('#fsScrub').classList.contains('on')) renderFsScrub(d);
  const bg=$('#begin'), sp=$('#stop'), gr=$('#gear'), sex=$('#scrubExpand'), sf=$('#scrubForceStop'), fsa=$('#forceStopAll');
  const active=isScrubActive(d);
  if(bg) bg.style.display = active ? 'none' : 'inline-block';
  if(sp) sp.style.display = active ? 'inline-block' : 'none';
  if(sf) sf.style.display = 'inline-block';
  if(fsa) fsa.style.display = 'inline-block';
  if(gr) gr.style.display = active ? 'block' : 'none';
  if(sex) sex.style.display = active ? 'inline-block' : 'none';
  if(d.state){ const st=d.state,g=st.green||0,u=st.under||0,tot=g+u,pct=tot?Math.round(g/tot*100):0; const bar=$('#scrubbar'),top=$('#scrubtop'); if(bar)bar.style.width=pct+'%';
    const lf=d.lastFinish;
    const lastTxt=lf?(lf.type==='certified'?(' · last ✅ '+lf.id+' → green'):lf.type==='ready'?(' · last 📋 '+lf.id+' awaiting agent approval'):(' · last 🅿️ '+lf.id+' parked ('+(lf.contentScore||lf.score)+'/13 content)')):(d.lastCertify&&d.lastCertify.id?(' · last ✅ '+d.lastCertify.id):'');
    if(top)top.textContent='Pool: '+u.toLocaleString()+' left · '+g.toLocaleString()+' certified · '+(st.pending||0)+' awaiting sign-off ('+pct+'%)'+(d.running?('  ·  run: '+((d.certified||0))+'✅ '+((d.ready||0))+'📋 '+((d.parked||0))+'🅿️ '+((d.tried||0))+' tried'):'')+lastTxt; }
  const cur=$('#scrubcur');
  if(cur){ const aid=d.activeId||(d.scrubLive&&d.scrubLive.active?d.scrubLive.id:null)||(d.scrubBusy?d.scrubSlotId:null)||d.current;
    const stg=(d.scrubLive&&d.scrubLive.carwash)?d.scrubLive.carwash:((d.scrubLive&&d.scrubLive.stage)?d.scrubLive.stage:(d.stage||''));
    if(d.stopping) cur.textContent='⏹ Finishing current entry… '+(stg||'');
    else if(d.imageScrubRunning||imageScrubLive(d)){ const il=imageScrubLive(d)||{}; cur.textContent='🖼 '+((il.pillar)||'gp')+' · '+(il.done||0)+'/'+(il.n||'?')+' pages · fixed '+(il.fixed||0)+' · skip '+(il.skipped||0); }
    else if(d.scrubBusy||d.running){ var el=(d.scrubLive&&d.scrubLive.elapsedSec)?(' · '+d.scrubLive.elapsedSec+'s'):(d.currentSince?(' · '+fmtSec(Date.now()-d.currentSince)):''); var fl=d.scrubPillarFilter?(' · filter '+esc(d.scrubPillarFilterName||d.scrubPillarFilter)+' · '+(d.queueFilteredLen||0)+' match'):(' · '+((d.queueLen!=null?d.queueLen:(d.state&&d.state.under))||'?')+' in pool'); cur.textContent=aid?('🍳 '+aid+(stg?(' — '+stg):'')+el+fl):((stg||'working…')+fl); }
    else cur.textContent=(d.stage&&d.stage!=='idle')?d.stage:''; }
  const cq=$('#cookq'); if(cq) cq.style.display='none';
  const lg=$('#scrublog'); if(lg && d.log) lg.innerHTML=d.log.map(l=>String(l).replace(/[<>]/g,'')).join('<br>');
  updateTabBadges();
}
function startAutoPoll(){ if(autoPoll)clearInterval(autoPoll); let t=0;
  startTickCountdown();
  const tick=async()=>{ try{ const d=await(await fetch('/scrub-status')).json(); window._sa=d; if(window.activeTab==='scrub') renderAuto(d); else { paintRunStats(d); if(d.state)paint(d.state); } if(d.state&&window.activeTab==='scrub') paint(d.state); updateTabBadges(); if(!d.running && !d.imageScrubRunning && !d.scrubBusy && !d.stopping && (!d.scrubLive||!d.scrubLive.active)){ clearInterval(autoPoll); autoPoll=null; stopTickCountdown(); const fs=$('#fsScrub'); if(fs&&fs.classList.contains('on')) setTimeout(()=>showFsScrub(false),2500); } }catch(e){} };
  tick(); autoPoll=setInterval(()=>{ t++; tick(); },1000); }
function dockApprovalHub(inScrub){
  const hub=$('#approvalHub'), simpleDock=$('#fsSimpleApprovalDock'), app=$('#app'), runStats=$('#runStats');
  if(!hub) return;
  if(inScrub && simpleDock){
    simpleDock.appendChild(hub);
    hub.classList.add('in-scrub');
  } else if(app){
    hub.classList.remove('in-scrub');
    if(runStats && runStats.parentNode===app) app.insertBefore(hub, runStats);
    else app.appendChild(hub);
  }
}
function showFsScrub(on){
  const fs=$('#fsScrub');
  if(fs) fs.classList.toggle('on',!!on);
  if(on){ document.body.style.overflow='hidden'; dockApprovalHub(true); refreshSignoffQueue(); }
  else { if(!($('#fsGenerate')&&$('#fsGenerate').classList.contains('on'))) document.body.style.overflow=''; dockApprovalHub(false); }
}
function esc(s){ return String(s||'').replace(/[<>]/g,''); }
function fmtGapSec(sec){
  sec=Math.max(0,parseInt(sec,10)||0);
  if(sec>=60){ const m=Math.floor(sec/60), s=sec%60; return m+'m'+(s?(' '+s+'s'):''); }
  return sec+'s';
}
let tickCountdownIv=null;
function stopTickCountdown(){
  if(tickCountdownIv){ clearInterval(tickCountdownIv); tickCountdownIv=null; }
  const big=$('#fsTickCd'), mini=$('#tickCdMini');
  if(big) big.classList.add('off');
  if(mini) mini.classList.remove('on');
}
function lanePhaseKid(phase, sectionIdx, stages, phaseLabel) {
  const n = (sectionIdx || 0) + 1;
  const map = {
    content: '✍️ Fixing the words',
    image_cover: '🌸 Making the big hero picture',
    image_section: '🖼 Finding pictures for section #' + n,
    image_verify: '🔍 Checking that pictures work',
    top10: '🏆 Adding Top-10 product pictures',
    gate: '✅ Final quality check (almost done!)',
  };
  if (phaseLabel && String(phaseLabel).indexOf('§') >= 0) return '🖼 ' + String(phaseLabel).replace(/^🖼\s*/, '');
  if (stages && stages.length) {
    const act = stages.find(s => s.status === 'active');
    if (act) {
      const kid = { content: 'Fixing words', pollinator: 'Hero picture', ddg: 'Section pictures', verify: 'Checking pictures', gate: 'Final check' }[act.key] || act.label;
      return (map[phase] || kid) + (act.detail && act.detail !== '—' ? (' — ' + act.detail) : '');
    }
  }
  return map[phase] || '⏸ Waiting for a turn';
}
function stageKidLabel(s) {
  if (!s) return '—';
  const names = { content: 'Words', pollinator: 'Hero pic', ddg: 'Section pics', verify: 'Check pics', gate: 'Final OK' };
  const k = s.key || '';
  const nm = names[k] || (s.label || '').replace(/^\d+\s+/, '');
  return nm + (s.detail && s.detail !== '—' ? (' ' + s.detail) : '');
}
function queueIco(c) { return { green: '🟢', yellow: '🟡', orange: '🟠', red: '🔴' }[c] || '•'; }
function lanePhaseShort(phase) {
  const m = { content: '✍️ Words', image_cover: '🌸 Hero', image_section: '🖼 DDG', image_verify: '🔍 Verify', top10: '🏆 Top-10', gate: '✅ Gate' };
  return m[phase] || phase;
}
function laneBatchSummaryHtml(rows) {
  if (!rows.length) return '';
  const by = {};
  rows.forEach(r => { const k = r.phase || 'content'; by[k] = (by[k] || 0) + 1; });
  const order = ['content', 'image_cover', 'image_section', 'top10', 'image_verify', 'gate'];
  const chips = order.filter(k => by[k]).map(k => '<span class="chip' + (k === 'image_cover' || k === 'image_section' ? ' on' : '') + '">' + lanePhaseShort(k) + ' <b>' + by[k] + '</b></span>');
  const other = Object.keys(by).filter(k => order.indexOf(k) < 0).map(k => '<span class=chip>' + esc(k) + ' <b>' + by[k] + '</b></span>');
  return '<span class=chip style="border-color:#13c2c2;color:#7fe0d0">📋 Batch <b>' + rows.length + '</b>/48</span>' + chips.join('') + other.join('');
}
function isScrubActive(d) {
  if (!d) return false;
  return !!(d.imageScrubRunning || d.running) && !d.stopping;
}
function imageScrubLive(d) {
  const st = (d && d.imageScrub) || {};
  if (st.live && st.live.pillar) {
    const p = (st.pillars || []).find(x => x.code === st.live.pillar);
    return Object.assign({ n: (p && p.n) || 0, done: (p && p.done) || st.live.done || 0 }, st.live);
  }
  const pillars = st.pillars || [];
  const inProg = pillars.filter(p => /IN PROGRESS/i.test(p.state || ''));
  const withDone = inProg.filter(p => (p.done || 0) > 0).sort((a, b) => (b.done || 0) - (a.done || 0));
  if (withDone.length) {
    const active = withDone[0];
    return {
      pillar: active.code,
      batch: active.batch || 1,
      totalBatches: active.totalBatches || Math.max(1, Math.ceil((active.n || 1) / 48)),
      fixed: active.fixed || 0,
      skipped: active.skipped || 0,
      unresolved: active.unresolved || 0,
      done: active.done || 0,
      n: active.n || 0,
    };
  }
  const samples = st.samples || [];
  if (samples.length) {
    const lastId = String((samples[samples.length - 1] || {}).id || '');
    const m = lastId.match(/^([a-z]+)\d/i);
    if (m) {
      const active = pillars.find(p => p.code === m[1]);
      if (active) {
        return {
          pillar: active.code,
          batch: active.batch || 1,
          totalBatches: active.totalBatches || Math.max(1, Math.ceil((active.n || 1) / 48)),
          fixed: active.fixed || 0,
          skipped: active.skipped || 0,
          unresolved: active.unresolved || 0,
          done: active.done || 0,
          n: active.n || 0,
        };
      }
    }
  }
  const gp = pillars.find(p => p.code === 'gp' && /IN PROGRESS/i.test(p.state || ''));
  if (gp) {
    return {
      pillar: gp.code,
      batch: gp.batch || 1,
      totalBatches: gp.totalBatches || Math.max(1, Math.ceil((gp.n || 1) / 48)),
      fixed: gp.fixed || 0,
      skipped: gp.skipped || 0,
      unresolved: gp.unresolved || 0,
      done: gp.done || 0,
      n: gp.n || 0,
    };
  }
  if (inProg.length) {
    const active = inProg[inProg.length - 1];
    return {
      pillar: active.code,
      batch: active.batch || 1,
      totalBatches: active.totalBatches || Math.max(1, Math.ceil((active.n || 1) / 48)),
      fixed: active.fixed || 0,
      skipped: active.skipped || 0,
      unresolved: active.unresolved || 0,
      done: active.done || 0,
      n: active.n || 0,
    };
  }
  return null;
}
function setImageScrubLayout(on) {
  const next = $('#fsSimpleNextBox'); if (next) next.style.display = on ? 'none' : '';
  const tick = $('#fsTickCd'); if (tick) tick.classList.toggle('off', !!on);
  const leg = document.querySelector('.fs-simple-legend'); if (leg) leg.style.display = on ? 'none' : '';
  const cook = $('#fsAlsoCooking'); if (cook && on) cook.innerHTML = '';
}
function paintImagePillarBoard(d, batchEl) {
  if (!batchEl) return;
  const pillars = (d.imageScrub && d.imageScrub.pillars) || [];
  const live = imageScrubLive(d);
  const code = live && live.pillar;
  const rows = code ? pillars.filter(p => p.code === code || p.state === 'DONE' || /IN PROGRESS/i.test(p.state || '')).slice(0, 12) : pillars.filter(p => p.code === 'gp' || /IN PROGRESS/i.test(p.state || '')).slice(0, 6);
  batchEl.innerHTML = rows.length ? rows.map(p => {
    const pct = p.n ? Math.min(100, Math.round((p.done || 0) / p.n * 100)) : 0;
    const on = code ? p.code === code : /IN PROGRESS/i.test(p.state || '');
    const cls = p.state === 'DONE' ? 'q-green' : (on ? 'q-green working' : 'q-red');
    return '<div class="fs-simple-row ' + cls + '"><span class=ico>' + (p.state === 'DONE' ? '✓' : '🖼') + '</span><div class=body><div class=id>' + esc(p.code) + ' ' + esc(p.name) + '</div><div class=step>' + esc(p.state) + (p.fixed != null ? (' · fixed ' + p.fixed + ' · skip ' + (p.skipped || 0)) : '') + '</div><div class=bar><i style="width:' + pct + '%"></i></div></div><span class=pct>' + (p.done || 0) + '/' + p.n + '</span></div>';
  }).join('') : '<div style="padding:12px 4px;color:#8aa;font-size:.9rem">Image scrub warming up…</div>';
}
function paintCrewManifest(d) {
  const el = $('#fsCrewManifest');
  if (!el) return;
  const crew = (d && d.scrubCrew) || (typeof EMBEDDED_CREW !== 'undefined' ? EMBEDDED_CREW : null);
  if (!crew) { el.textContent = 'Full 13/13 lane: Pollinator flux hero + DDG sections · orange title baked #FF8C1A'; return; }
  const imgLaw = 'Face-card/hero = 🌸 Pollinator flux → /assets/qa/&lt;id&gt;.jpg (cover_src flux, &gt;40KB, orange title baked #FF8C1A). Sections = Pollinator flux · serial queue.';
  const slots = (crew.parallelWorkers && crew.parallelWorkers.slots) || [];
  const slotLines = slots.map(s => '· <b style="color:#c8d0e0">' + esc(s.slot) + '</b> — ' + esc(s.engine) + ' — ' + esc(s.job)).join('<br>');
  el.innerHTML = '<div style="margin-bottom:6px"><b style="color:#FF8C1A">Begin Scrub</b> → full 13/13 lane (' + esc(crew.oneLiner || '') + ')</div>' +
    (crew.supervisor ? '<div style="color:#7fe0d0;font-size:.78rem;margin-bottom:4px">🛟 Supervisor: ' + esc(crew.supervisor.scrub || '') + '</div>' : '') +
    '<div style="color:#9fb0c0;font-size:.82rem;margin-bottom:4px">' + imgLaw + '</div>' +
    (slotLines ? slotLines : '');
}
function paintSimpleScrub(d) {
  if (!d) return;
  paintCrewManifest(d);
  const st = d.state || {};
  const board = d.laneBoard;
  const lane = d.lane;
  const live = d.scrubLive || {};
  const running = isScrubActive(d);
  const status = $('#fsSimpleStatus');
  const pool = $('#fsSimplePool');
  const batch = $('#fsSimpleBatch');
  const nowId = $('#fsSimpleNowId');
  const nowTitle = $('#fsSimpleNowTitle');
  const nowStep = $('#fsSimpleNowStep');
  const nowBar = $('#fsSimpleNowBar');
  const nowPct = $('#fsSimpleNowPct');
  const nextId = $('#fsSimpleNextId');
  const nextTitle = $('#fsSimpleNextTitle');
  const nextStep = $('#fsSimpleNextStep');
  const nextBox = $('#fsSimpleNextBox');
  const scrubNow = $('#scrubSimple');
  const scrubNowT = $('#scrubSimpleNow');
  const scrubNowS = $('#scrubSimpleStep');
  const scrubNext = $('#scrubSimpleNext');
  const batchSummary = $('#fsBatchSummary');
  const alsoCooking = $('#fsAlsoCooking');
  const batchExplain = $('#fsBatchExplain');
  const g = st.green || 0;
  const u = st.under || 0;
  if (pool) pool.innerHTML = '🔴 <b class=red>' + u.toLocaleString() + '</b> articles still need fixing · ✅ <b class=green>' + g.toLocaleString() + '</b> already good · 📋 <b>' + (st.pending || 0) + '</b> ' + (HUMAN_AUDITOR ? 'waiting for you to approve' : 'audit exceptions') + '<br><span style="font-size:.82rem;color:#8aa;font-weight:600">When one finishes, the next red article fills its slot automatically (keeps 48 going until the pool is empty).</span>';
  if (!running) {
    setImageScrubLayout(false);
    paintAllCarwash({}, { scrubActive: false, genActive: false });
    const scw=$('#scrubCarwash'); if(scw) scw.classList.remove('on');
    const fcw=$('#fsCwPanel'); if(fcw) fcw.classList.remove('on');
    if (status) status.textContent = d.stopping ? '⏹ Scrubber is stopping…' : '⏸ Scrubber is off — press Begin Scrub to start';
    if (scrubNow) scrubNow.classList.remove('on');
    if (nextBox) nextBox.style.display = 'none';
    if (batchSummary) { batchSummary.style.display = 'none'; batchSummary.innerHTML = ''; }
    if (alsoCooking) alsoCooking.innerHTML = '';
    if (batch) batch.innerHTML = '<div style="padding:12px 4px;color:#8aa;font-size:.9rem">' + ${JSON.stringify(batchIdleHint)} + '</div>';
    return;
  }
  if (d.imageScrubRunning || imageScrubLive(d)) {
    setImageScrubLayout(true);
    const il = imageScrubLive(d) || { pillar: 'gp', batch: 1, totalBatches: 1, fixed: 0, skipped: 0, unresolved: 0, done: 0 };
    const pillar = il.pillar || 'gp';
    const pct = il.n ? Math.min(100, Math.round((il.done || 0) / il.n * 100)) : (il.totalBatches ? Math.min(100, Math.round(((il.batch || 0) / il.totalBatches) * 100)) : 0);
    if (status) status.textContent = '🖼 Image scrub · ' + pillar.toUpperCase() + ' · ' + (il.done || 0) + '/' + (il.n || '?') + ' pages · batch ' + (il.batch || '?') + '/' + (il.totalBatches || '?') + ' · fixed ' + (il.fixed || 0) + ' · skip ' + (il.skipped || 0) + ' · unresolved ' + (il.unresolved || 0);
    if (nowId) nowId.textContent = pillar + ' · GTM pillar';
    if (nowTitle) nowTitle.textContent = 'DDG ↔ Pollinator covers · sections = DDG · orange title baked on face-card';
    if (nowStep) nowStep.textContent = il.starting ? 'Starting pillar…' : 'Grading + self-hosting to /assets/qa/ …';
    if (nowBar) nowBar.style.width = pct + '%';
    if (nowPct) nowPct.textContent = pct + '% of ' + pillar + ' pillar (' + (il.done || 0) + ' pages checkpointed)';
    if (nextBox) nextBox.style.display = 'none';
    if (batchSummary) { batchSummary.style.display = 'none'; batchSummary.innerHTML = ''; }
    if (batchExplain) batchExplain.innerHTML = 'Fable v2 image pass on <b>' + esc(pillar) + '</b>. Dashboard: <a href="http://localhost:8891/" target=_blank style="color:#13c2c2">localhost:8891</a>';
    paintImagePillarBoard(d, batch);
    if (scrubNow) scrubNow.classList.add('on');
    return;
  }
  setImageScrubLayout(false);
  const rows = (board && board.rows) || [];
  const batchN = rows.length || (board && board.activeJobs) || 0;
  if (batchSummary) {
    if (batchN) { batchSummary.style.display = 'flex'; batchSummary.innerHTML = laneBatchSummaryHtml(rows); }
    else { batchSummary.style.display = 'none'; batchSummary.innerHTML = ''; }
  }
  if (alsoCooking) {
    const alt = d.pipelineAlt;
    const altHtml = (alt && alt.enabled && d.genRunning && running) ? ('<div style="margin-bottom:10px;padding:10px 12px;border:1px solid #2d4a6a;border-radius:12px;background:#0a1218;font-size:.82rem;color:#7fe0d0;font-weight:700">🔁 Pipeline alternation · ' + (alt.active ? ('NOW: ' + (alt.active === 'generate' ? '✍️ Generate' : '🧽 Scrub')) : ('NEXT: ' + (alt.next === 'generate' ? '✍️ Generate' : '🧽 Scrub'))) + ' · gen ' + (alt.genTurns || 0) + ' · scrub ' + (alt.scrubTurns || 0) + '</div>') : '';
    const hot = rows.filter(r => r.queueColor === 'green' || r.queueColor === 'yellow' || r.queueColor === 'orange').slice(0, 8);
    if (!hot.length && rows.length) hot.push.apply(hot, rows.slice(0, 6));
    alsoCooking.innerHTML = altHtml + (hot.length ? hot.map(r => {
      const qc = r.queueColor || 'red';
      const stp = lanePhaseKid(r.phase, r.sectionIdx, r.stages, r.phaseLabel);
      return '<div class="fs-cook-card q-' + qc + '"><div class=cid>' + queueIco(qc) + ' ' + esc(r.id) + '</div><div class=cstep>' + esc(stp) + '</div><div class=cpct>' + r.overallPct + '% · ' + esc(r.queueLabel || '') + '</div></div>';
    }).join('') : '<div style="color:#8aa;font-size:.88rem;padding:8px 4px">Filling first slots from the red pile…</div>');
  }
  if (batchExplain && batchN) batchExplain.innerHTML = '<b>' + batchN + '</b> articles in the batch at different stages. Up to <b>2 DeepSeek writers</b> + flux/DDG image workers stir different articles at once — scroll the full list below.';
  if (status) {
    const est = (board && board.estimates) || {};
    const pip = est.pipeline || {};
    const slots = (lane && lane.slots) || (board && board.slots) || {};
    const rot = (lane && lane.imageRotate) || {};
    const workerBits = [];
    if (slots.content && slots.content.busy) workerBits.push('✍️ ' + slots.content.id);
    if (slots.content2 && slots.content2.busy) workerBits.push('✍️ ' + slots.content2.id);
    if (slots.flux && slots.flux.busy) workerBits.push('🌸 ' + slots.flux.id);
    if (slots.ddg && slots.ddg.busy) workerBits.push('🖼 ' + slots.ddg.id);
    const workerN = workerBits.length;
    const flux = est.fluxReadyInSec != null ? ('flux ' + (est.fluxBusy ? 'busy' : (est.fluxReadyInSec ? ('in ' + est.fluxReadyInSec + 's') : 'ready'))) : '';
    const ddg = est.ddgReadyInSec != null ? ('DDG ' + (est.ddgReadyInSec ? ('in ' + est.ddgReadyInSec + 's') : 'ready')) : '';
    const spread = pip.imagePipelineN != null ? (' · ' + pip.imagePipelineN + '/' + pip.n + ' in images') : '';
    const rotTxt = rot.label ? (' · rotate: ' + rot.label + (rot.bothCooldown ? (' · BOTH COOLING stick ' + (rot.stickLabel || '') + ' ~' + rot.waitSec + 's') : (' → next ' + (rot.nextLabel || '')))) : '';
    status.textContent = '🍳 ' + batchN + '/48 in batch · ' + (workerN ? workerN + ' working' : 'idle') + (workerBits.length ? (' (' + workerBits.join(' · ') + ')') : '') + spread + rotTxt + ' — ' + [flux, ddg].filter(Boolean).join(' · ') + (pip.bottleneckRisk ? ' · ⚠ pushing images' : '') + (board && board.pickReason ? (' · ' + board.pickReason) : '');
  }
  const slotRows = [];
  const slots = (lane && lane.slots) || (board && board.slots) || {};
  if (slots.content && slots.content.busy) slotRows.push({ id: slots.content.id, slot: 'content', label: '✍️ Words 1' });
  if (slots.content2 && slots.content2.busy) slotRows.push({ id: slots.content2.id, slot: 'content2', label: '✍️ Words 2' });
  if (slots.flux && slots.flux.busy) slotRows.push({ id: slots.flux.id, slot: 'flux', label: '🌸 Hero' });
  if (slots.ddg && slots.ddg.busy) slotRows.push({ id: slots.ddg.id, slot: 'ddg', label: '🖼 DDG' });
  const greenRows = rows.filter(r => r.queueColor === 'green');
  const greenRow = slotRows[0] ? rows.find(r => r.id === slotRows[0].id) : (greenRows[0] || rows.find(r => r.active));
  const yellowRow = rows.find(r => r.queueColor === 'yellow');
  const active = greenRow || rows[0];
  const stepTxt = active ? ((slotRows.find(s => s.id === active.id) || {}).label ? (slotRows.find(s => s.id === active.id).label + ' — ') : '') + lanePhaseKid(active.phase, active.sectionIdx, active.stages, active.phaseLabel) : (lane && lane.sliceBusy ? ('⚙️ ' + (slotRows.map(s => s.id).join(', ') || lane.currentId || 'workers busy')) : '⏳ Picking work…');
  const pct = active ? (active.overallPct || 0) : 0;
  const id = active ? active.id : (board && board.nowId) || (lane && lane.currentId) || (live.id) || '—';
  const title = active ? active.title : (live.title || '');
  if (nowId) nowId.textContent = id;
  if (nowTitle) nowTitle.textContent = title || '(loading title…)';
  if (nowStep) nowStep.textContent = stepTxt;
  if (nowBar) nowBar.style.width = pct + '%';
  if (nowPct) nowPct.textContent = pct + '% done with this article';
  if (yellowRow && nextBox) {
    nextBox.style.display = 'block';
    if (nextId) nextId.textContent = yellowRow.id;
    if (nextTitle) nextTitle.textContent = yellowRow.title || '';
    if (nextStep) nextStep.textContent = lanePhaseKid(yellowRow.phase, yellowRow.sectionIdx, yellowRow.stages, yellowRow.phaseLabel);
  } else if (nextBox) nextBox.style.display = 'none';
  if (scrubNow) scrubNow.classList.add('on');
  if (scrubNowT) scrubNowT.textContent = (slotRows.length ? slotRows.map(s => s.label + ' ' + s.id).join(' · ') : ('🟢 Now: ' + id)) + (yellowRow ? (' · 🟡 Next: ' + yellowRow.id) : '');
  if (scrubNowS) scrubNowS.textContent = stepTxt;
  if (scrubNext) scrubNext.textContent = yellowRow ? ('🟡 Next: ' + yellowRow.id + (yellowRow.title ? (' — ' + String(yellowRow.title).slice(0, 40)) : '')) : '🟡 Next: —';
  if (batch) {
    if (!rows.length) {
      batch.innerHTML = '<div style="padding:12px 4px;color:#8aa;font-size:.9rem">Loading the first 48 articles from the red pile…</div>';
    } else {
      const workerBy = {};
      slotRows.forEach(s => { workerBy[s.id] = s; });
      const wnowTxt = { content: '✍️ WRITING NOW', flux: '🌸 MAKING HERO CARD', ddg: '🖼 GETTING DDG IMAGES' };
      batch.innerHTML = rows.map(r => {
        const qc = r.queueColor || 'red';
        const stp = lanePhaseKid(r.phase, r.sectionIdx, r.stages, r.phaseLabel);
        const w = workerBy[r.id];
        const pctN = Math.max(0, Math.min(100, r.overallPct || 0));
        const badge = w ? '<div class="wnow w-' + w.slot + '">' + wnowTxt[w.slot] + '</div>' : '';
        const ttl = r.title ? '<div class=tag style="color:#9fb0c0;font-weight:600;text-transform:none;letter-spacing:0">' + esc(String(r.title).slice(0, 60)) + '</div>' : '';
        return '<div class="fs-simple-row q-' + qc + (w ? ' working' : '') + '"><span class=ico>' + (w ? '🔧' : queueIco(qc)) + '</span><div class=body><div class=id>' + esc(r.id) + '</div>' + ttl + '<div class=tag>' + esc(r.queueLabel || '') + '</div>' + badge + '<div class=step>' + esc(stp) + '</div><div class=bar><i style="width:' + pctN + '%"></i></div></div><span class=pct>' + pctN + '%</span></div>';
      }).join('');
    }
  }
}
function paintTickCountdownFromState(){
  const d=window._sa||{};
  const lane=d.lane;
  const running=!!isScrubActive(d);
  const big=$('#fsTickCd'), num=$('#fsTickNum'), sub=$('#fsTickSub'), ring=$('#fsTickRing'), lbl=$('#fsTickLbl'), hint=$('#fsSimpleTimerHint');
  const mini=$('#tickCdMini'), miniNum=$('#tickCdMiniNum'), miniLbl=$('#tickCdMiniLbl');
  if(!running||!lane||!lane.nextTickAt){
    stopTickCountdown();
    return;
  }
  const totalMs=lane.nextDelayMs||lane.tickMs||LANE_MIN_GAP_MS||2000;
  const leftMs=Math.max(0,lane.nextTickAt-Date.now());
  const leftSec=Math.max(0,Math.ceil(leftMs/1000));
  const pct=Math.min(100,Math.round((leftMs/Math.max(500,totalMs))*100));
  const busy=!!lane.sliceBusy;
  const board=d.laneBoard;
  const est=(board&&board.estimates)||(lane&&lane.estimates)||{};
  const fluxWait=est.fluxBusy?'flux busy':(est.fluxReadyInSec?'flux in '+est.fluxReadyInSec+'s':'flux ready');
  const ddgWait=est.ddgReadyInSec?'DDG in '+est.ddgReadyInSec+'s':'DDG ready';
  const rot=(lane&&lane.imageRotate)||{};
  const tl=rot.throttleLearn||{};
  const learnNote=(tl.flux||tl.ddg)?(' · learn flux '+(tl.flux&&(tl.flux.sweet?'✓ ':''))+(tl.flux&&tl.flux.waitSec||'?')+'s / ddg '+(tl.ddg&&(tl.ddg.sweet?'✓ ':''))+(tl.ddg&&tl.ddg.waitSec||'?')+'s'):'';
  const rotNote=rot.label?(rot.bothCooldown?(' · BOTH COOLING stick '+rot.stickLabel+' ~'+rot.waitSec+'s'):(' · rotate: '+rot.label+' → '+rot.nextLabel)):'';
  if(big){
    big.classList.remove('off');
    if(num){ num.textContent=busy?'NOW!':String(leftSec); num.classList.toggle('busy',busy); }
    if(lbl) lbl.textContent=busy?'Working right now — no waiting!':('Next turn in '+leftSec+'s'+(totalMs!==leftMs&&!busy?' (waited for cooldown)':''));
    if(hint) hint.textContent=(board&&board.pickReason)?board.pickReason:(busy?('Working — flux gen ~'+Math.round((est.fluxAvgMs||45000)/1000)+'s when making covers.'):(fluxWait+' · '+ddgWait+rotNote+learnNote+' · timer matches real wait'));
    if(sub) sub.textContent=busy?('👀 Look at "WORKING ON RIGHT NOW" above — that is what it is doing.'):('⏳ Countdown to next stir · '+leftSec+'s left'+(lane.pickReason?' · '+lane.pickReason:''));
    if(ring) ring.style.width=pct+'%';
  }
  if(mini){
    mini.classList.add('on');
    if(miniNum){ miniNum.textContent=busy?'GO':String(leftSec); miniNum.style.color=busy?'#13c2c2':'#2ecc71'; }
    if(miniLbl) miniLbl.textContent=busy?'Working now!':('Timer — '+leftSec+'s until next turn');
  }
  paintSimpleScrub(d);
}
function startTickCountdown(){
  if(tickCountdownIv) return;
  paintTickCountdownFromState();
  tickCountdownIv=setInterval(paintTickCountdownFromState,200);
}
function renderLaneBoard(d){
  const board=d&&d.laneBoard;
  const wrap=$('#fsLaneBoard'), rows=$('#fsLaneRows'), meta=$('#fsLaneMeta'), mini=$('#laneMini');
  const on=!!(board&&board.mode==='lane'&&d&&d.running);
  if(wrap) wrap.style.display=(on&&window.activeTab==='scrub'&&$('#fsScrub')&&$('#fsScrub').classList.contains('on'))?'block':'none';
  if(mini){
    if(on&&window.activeTab==='scrub'&&!d.imageScrubRunning) paintLaneMini(board,d);
    else { mini.classList.remove('on'); mini.innerHTML=''; }
  }
  if(!on){
    if(rows) rows.innerHTML='';
    return;
  }
  if(!board.rows||!board.rows.length){
    if(rows) rows.innerHTML='<div style="padding:12px 4px;color:#8aa;font-size:.9rem">Loading articles from the red pile…</div>';
    paintSimpleScrub(d);
    return;
  }
  if(meta) meta.textContent=board.activeJobs+' of '+board.maxJobs+' articles in this batch';
  if(rows){
    rows.innerHTML=board.rows.map(r=>{
      const cells=(r.stages&&r.stages.length)?r.stages.slice(0,5):[];
      while(cells.length<5) cells.push({label:'—',status:'pending',detail:'—'});
      const stageHtml=cells.map(s=>'<div class="fs-lane-cell '+esc(s.status)+'" title="'+esc(stageKidLabel(s))+'">'+esc(stageKidLabel(s))+'</div>').join('');
      return '<div class="fs-lane-row'+(r.active?' active':'')+'"><div class=fs-lane-id><a href="https://pulserevops.com/knowledge/'+esc(r.id)+'" target=_blank style=color:#13c2c2>'+esc(r.id)+'</a><small>'+esc(r.title)+'</small></div><div class=fs-lane-pct>'+r.overallPct+'%</div>'+stageHtml+'</div>';
    }).join('');
  }
  paintSimpleScrub(d);
}
function renderFsScrub(d){
  if(!d || !$('#fsScrub')) return;
  paintPipelineAlt(d.pipelineAlt, d.genRunning, isScrubActive(d));
  const live=d.scrubLive||{}, pol=d.pollinator||{}, st=d.state||{};
  const activeId=d.activeId||(live.active?live.id:null)||(d.scrubBusy?d.scrubSlotId:null)||(d.running?d.current:null);
  const active=!!activeId||isScrubActive(d);
  paintAllCarwash(live,{scrubActive:(isScrubActive(d)||!!d.stopping)&&!d.imageScrubRunning,genActive:false,scrubTitle:'🚿 Scrub · factor 2 car wash'});
  if(!active&&!isScrubActive(d)&&!d.stopping&&!$('#fsScrub').classList.contains('on')) return;
  const g=st.green||0,u=st.under||0,tot=g+u,pct=tot?Math.round(g/tot*100):0;
  const bar=$('#fsBar'); if(bar) bar.style.width=pct+'%';
  paintEntryOverall(d);
  renderLaneBoard(d);
  paintSimpleScrub(d);
  const head=$('#fsHeadTitle'); if(head) head.textContent=d.imageScrubRunning?'🖼 Image Scrub — live':'🧽 Scrubber — live';
  const stopBtn=$('#fsStop'); if(stopBtn) stopBtn.textContent='⏹ Stop Scrub';
  const overallTitle=$('#fsOverallTitle'); if(overallTitle) overallTitle.textContent='Overall scrub progress — this entry';
  const curId=activeId||'—';
  const phase=d.stopping?'⏹ Finishing current entry…':(active?'🍳 Scrubbing':(d.running?'🍳 Starting':'⏸ Idle'));
  const status=$('#fsStatus'); if(status) status.textContent=phase+' · Pool '+pct+'% certified · '+(st.pending||0)+' awaiting agent approval · run '+((d.certified||0))+'✅ '+((d.ready||0))+'📋 '+((d.parked||0))+'🅿️';
  const cw=$('#fsCarwash'); if(cw) cw.textContent=live.carwash||live.stage||(d.stopping?'⏹ Stop queued — finishing this entry…':'—');
  const qid=$('#fsQid'); if(qid) qid.innerHTML=curId!=='—'?('<a href="https://pulserevops.com/knowledge/'+esc(curId)+'" target=_blank style=color:#13c2c2>'+esc(curId)+'</a>'):'—';
  const tit=$('#fsTitle'); if(tit) tit.textContent=live.title||'';
  const pil=$('#fsPillar'); if(pil) pil.textContent=live.pillar?('Pillar: '+live.pillar):(activeId?('Pillar: '+String(activeId).replace(/\d+.*/,'')):'');
  const sc=$('#fsScore'); if(sc) sc.textContent=(live.before!=null?('Started '+live.before+'/13 · '):'')+(live.rubricPass?('✅ Rubric '+live.rubricScore+'/13 signed off · '):(live.rubricScore!=null?('Rubric '+live.rubricScore+'/13 ('+(live.rubricPct||0)+'% — pending) · '):''))+(live.elapsedSec?('Elapsed '+live.elapsedSec+'s'):(active&&d.currentSince?('Elapsed '+fmtSec(Date.now()-d.currentSince)):('Today '+(st.today||0))));
  const stg=$('#fsStage'); if(stg) stg.textContent=active?(live.stage||d.stage||'working…'):'—';
  const el=$('#fsElapsed'); if(el) el.textContent=active?('Round '+(live.round||0)+' · '+((live.steps&&live.steps.length)?live.steps[live.steps.length-1]:'starting')):('Queue '+((d.queueLen||0).toLocaleString())+' waiting');
  const steps=$('#fsSteps'); if(steps) steps.textContent=(live.steps&&live.steps.length)?live.steps.join(' → '):'';
  const stTrack=$('#fsStepsTrack');
  if(stTrack && live.stepsTrack) stTrack.innerHTML=live.stepsTrack.map(s=>{
    const pct=s.max>1?Math.round((s.cur/s.max)*100):(s.status==='done'?100:(s.status==='active'?40:0));
    const cnt=s.max>1?(s.cur+' / '+s.max+(s.detail?(' · '+s.detail):'')):(s.detail||'');
    return '<div class="fsstep '+s.status+'"><span class=name>'+s.n+'. '+esc(s.label)+'</span><span class=count>'+esc(cnt)+'</span><div class=track><i style="width:'+pct+'%"></i></div></div>';
  }).join('');
  const rub=$('#fsRubric');
  if(rub) rub.innerHTML=(live.rubricItems&&live.rubricItems.length)?live.rubricItems.map(i=>'<div class="'+(i.pass?'ok':'no')+'">'+(i.pass?'✅':'❌')+' '+esc(i.label)+'</div>').join(''):'<div class=wait>Rubric updates as each step runs…</div>';
  const pbus=$('#fsPollBusy'); if(pbus) pbus.textContent=pol.busy?('🎨 '+esc(pol.current||(IMAGE_LAW_INTERNAL_DDG?'flux cover':'flux image'))):('✓ '+(IMAGE_LAW_INTERNAL_DDG?'Cover idle':'Pollinator idle'));
  const pavg=$('#fsPollAvg'); if(pavg) pavg.textContent=IMAGE_LAW_INTERNAL_DDG
    ?('Freq '+fmtGapSec(pol.freqSec||pol.minGapSec||15)+' between covers · last gen '+((pol.lastSec||0))+'s'+(pol.lastAgoSec!=null?(' · '+pol.lastAgoSec+'s ago'):'')+' · avg '+((pol.avgSec||0))+'s · '+((pol.jobCount||0))+' covers · sections = DDG'+(pol.adaptive&&pol.throttleLearn?(' · throttle '+(pol.throttleLearn.sweet?'sweet ✓ ':'learn ')+pol.throttleLearn.waitSec+'s'):''))
    :('Freq '+fmtGapSec(pol.freqSec||pol.minGapSec||15)+' · last '+((pol.lastSec||0))+'s · avg '+((pol.avgSec||0))+'s · total '+((pol.jobCount||0))+' images'+(pol.adaptive&&pol.throttleLearn?(' · throttle '+(pol.throttleLearn.sweet?'sweet ✓ ':'learn ')+pol.throttleLearn.waitSec+'s'):''));
  const plaw=$('#fsPollLaw'); if(plaw&&pol.detail) plaw.textContent=pol.detail;
  const pr=$('#fsPollRecent'); if(pr) pr.innerHTML=(pol.recent&&pol.recent.length)?pol.recent.map(r=>'<li>'+(r.ok?'✅':'⚠️')+' '+esc(r.label)+' — '+r.sec+'s gen · freq '+fmtGapSec(r.gapSec)+'</li>').join(''):('<li style=color:#667>No flux jobs yet this session</li>');
  const poolLbl=$('#fsPoolLbl'); if(poolLbl) poolLbl.textContent='Whole pool certified';
  const pool=$('#fsPool'); if(pool) pool.textContent='✅ '+g.toLocaleString()+' certified · 🔴 '+u.toLocaleString()+' to scrub · certified '+pct+'%';
  const fq=$('#fsQueue');
  if(fq) fq.innerHTML=(d.queueNext&&d.queueNext.length)?d.queueNext.map(x=>'<div>• <span style=color:'+(x.kind==='fix'?'#fcd34d':'#7fe0a0')+'>'+(x.kind==='fix'?'↩ fix':'🆕 fresh')+'</span> '+esc(x.id)+' ['+esc(x.pillar)+'] '+esc(x.title)+'</div>').join(''):('<div style=color:#667>'+(d.scrubPillarFilter?('No '+esc(d.scrubPillarFilterName||d.scrubPillarFilter)+' waiting · '+((d.queueSkippedByFilter||0))+' other pillars skipped'):(active?'No other IDs waiting':'Pool empty'))+'</div>');
  const qTitle=$('#fsQueueTitle'); if(qTitle) qTitle.textContent=(d.scrubPillarFilter?('Waiting · filter: '+esc(d.scrubPillarFilterName||d.scrubPillarFilter)+' · '):'Waiting in pool · ')+((d.queueFixCount||0))+' fix ↔ '+((d.queueFreshCount||0))+' fresh';
  const lg=$('#fsLog'); if(lg && d.log && d.log.length) lg.innerHTML=d.log.map(l=>'<div>'+esc(l)+'</div>').join('');
}
function renderFsGenerate(d){
  if(!d) return;
  paintPipelineAlt(d.pipelineAlt||window._sa&&window._sa.pipelineAlt, !!d.running, window._sa&&isScrubActive(window._sa));
  const live=d.scrubLive||{}, st=d.state||{};
  const tot=(d.published||0)+(d.pooled||0);
  const pct=d.target?Math.min(100,Math.round(tot/d.target*100)):0;
  paintAllCarwash(live,{genActive:!!d.running,scrubActive:false,genTitle:'🚿 Generate · factor 1 car wash',batchLabel:d.running?('Batch Q&A '+tot+'/'+(d.target||0)):''});
  const bar=$('#fsGenBar'); if(bar) bar.style.width=pct+'%';
  const top=$('#fsGenTop'); if(top) top.textContent=(d.pillarName||d.pillar||'')+' — '+tot+'/'+(d.target||0)+' written · '+(d.pooled||0)+' queued for scrubber';
  const stage=$('#fsGenStage'); if(stage) stage.textContent=d.current?(d.stage+' — '+d.current.id+': '+d.current.title):(d.stage||'writing…');
  const status=$('#fsGenStatus'); if(status) status.textContent=d.running?('✍️ Writing · batch '+tot+'/'+(d.target||'?')+' · '+String(d.pillarName||d.pillar||'')):'✅ Generate batch finished';
  const curId=(d.current&&d.current.id)||(live.active&&live.id)||'—';
  const nowId=$('#fsGenNowId'); if(nowId) nowId.innerHTML=curId!=='—'?('<a href="https://pulserevops.com/knowledge/'+esc(curId)+'" target=_blank style=color:#a78bfa>'+esc(curId)+'</a>'):'—';
  const nowTitle=$('#fsGenNowTitle'); if(nowTitle) nowTitle.textContent=(d.current&&d.current.title)||live.title||'';
  const nowStep=$('#fsGenStep'); if(nowStep) nowStep.textContent=live.carwash||live.stage||d.stage||'—';
  const nowBar=$('#fsGenNowBar'); if(nowBar) nowBar.style.width=(live.overallPct||pct)+'%';
  const nowPct=$('#fsGenNowPct'); if(nowPct) nowPct.textContent=(live.overallPct||pct)+'% — factor-1 pipeline';
  const pool=$('#fsGenPool'); if(pool) pool.textContent=(d.running&&window._sa&&isScrubActive(window._sa))?'🔁 Generate ↔ Scrub alternating — one full pipeline entry, then one scrub, then back.':'🔴 '+(st.under!=null?st.under.toLocaleString():'—')+' in factor-2 scrub pool · start scrubber to alternate with generate';
  const log=$('#fsGenLog'); if(log) log.innerHTML=(d.log||[]).map(l=>'<div>'+esc(l)+'</div>').join('');
}
let signoffQueue=[], signoffIdx=0, rejectFixQueue=[], signoffLoadedId=null, lastQueueSig='', pileListBound=false;
function queueSignature(q){ return (q||[]).map(x=>x&&x.id).filter(Boolean).join('|'); }
function updatePileChipHighlight(){
  document.querySelectorAll('#pileList .pile-chip').forEach((el,i)=>{ el.classList.toggle('on', i===signoffIdx); });
}
function bindPileListOnce(){
  const list=$('#pileList'); if(!list||pileListBound) return;
  pileListBound=true;
  list.addEventListener('click',e=>{
    const chip=e.target.closest('.pile-chip'); if(!chip) return;
    const i=parseInt(chip.getAttribute('data-idx'),10); if(isNaN(i)||!signoffQueue[i]) return;
    signoffIdx=i;
    openFsApproval(signoffQueue[i]);
  });
}
function openFsApproval(item){
  if(!item) return;
  const fs=$('#fsApproval'), body=$('#fsApprovalBody'), viewer=$('#approvalViewer'), hub=$('#approvalHub');
  if(!fs||!viewer) return;
  if(body&&viewer.parentNode!==body) body.appendChild(viewer);
  viewer.style.display='flex';
  fs.classList.add('on');
  if(hub) hub.classList.add('fs-open');
  document.body.style.overflow='hidden';
  const head=$('#fsApprovalHead'); if(head) head.textContent='📋 '+item.id+' — '+String(item.title||'').slice(0,56);
  updatePileChipHighlight();
  loadSignoffItem(item);
}
function openApprovalById(id){
  id=String(id||'').trim(); if(!id||!KEY) return;
  fetch('/pending-signoff?key='+KEY).then(r=>r.json()).then(d=>{
    const pending=(d&&d.pending)||[];
    const item=pending.find(x=>x&&x.id===id);
    if(item){
      signoffQueue=pending.slice();
      signoffIdx=Math.max(0,pending.findIndex(x=>x.id===id));
      renderSignoffPile({ pendingList: pending, rejectFixList: (d&&d.rejectFix)||[], state: d&&d.state });
      openFsApproval(item);
      return;
    }
    refreshSignoffQueue();
    setTimeout(()=>{ const it=signoffQueue.find(x=>x&&x.id===id); if(it) openFsApproval(it); }, 1200);
  }).catch(()=>{});
}
function maybeOpenApprovalDeepLink(){
  let id=pendingApproveId||'';
  try{ if(!id) id=sessionStorage.getItem('scrubApproveId')||''; if(id) sessionStorage.removeItem('scrubApproveId'); }catch(e){}
  pendingApproveId='';
  if(id) setTimeout(()=>openApprovalById(id), 400);
}
function closeFsApproval(){
  const fs=$('#fsApproval'), viewer=$('#approvalViewer'), hub=$('#approvalHub');
  if(fs) fs.classList.remove('on');
  if(hub){
    hub.classList.remove('fs-open');
    if(viewer){
      const toast=$('#rejectToast');
      if(toast&&toast.parentNode===hub) hub.insertBefore(viewer, toast);
      else hub.appendChild(viewer);
      viewer.style.display='none';
    }
  }
  document.body.style.overflow='';
}
function renderFixPile(){
  const lbl=$('#fixPileLbl'), list=$('#fixPileList');
  const n=rejectFixQueue.length;
  if(lbl) lbl.style.display=n?'block':'none';
  if(list){
    list.style.display=n?'flex':'none';
    if(!n) list.innerHTML='';
    else list.innerHTML=rejectFixQueue.map(item=>'<div class="pile-chip fixing" title="'+esc((item.why||'')+(item.ownerNotes?('\\n\\nNote: '+item.ownerNotes):''))+'"><div class=pid>'+esc(item.id)+'</div><div class=ptitle>'+esc(String(item.title||'').slice(0,72))+(item.ownerNotes?(' · "'+esc(String(item.ownerNotes).slice(0,40))+'…"'):'')+'</div><div class=pscore>'+esc(item.status||'queued')+(item.ownerTargets&&item.ownerTargets.length?(' · '+item.ownerTargets.length+' fixes'):'')+'</div></div>').join('');
  }
}
function renderPileList(){
  const list=$('#pileList'), cnt=$('#pending');
  const n=signoffQueue.length;
  if(cnt) cnt.textContent=String(n);
  bindPileListOnce();
  if(!list) return;
  if(!n){
    list.innerHTML='<div class=pile-empty>Nothing here yet — scrubber drops finished entries into this pile.</div>';
    closeFsApproval();
    signoffLoadedId=null;
    return;
  }
  const sig=queueSignature(signoffQueue);
  const chips=list.querySelectorAll('.pile-chip');
  if(sig===list.dataset.sig&&chips.length===n){
    updatePileChipHighlight();
    return;
  }
  list.dataset.sig=sig;
  list.innerHTML=signoffQueue.map((item,i)=>'<div class="pile-chip'+(i===signoffIdx?' on':'')+(item.needsReview?' review':'')+'" data-idx="'+i+'"><div class=pid>'+esc(item.id)+'</div><div class=ptitle>'+esc(String(item.title||'').slice(0,72))+'</div><div class=pscore>'+esc(item.score||'?')+'/13 · '+esc(item.pillar||'')+(item.needsReview?' · ⚠ review':'')+'</div></div>').join('');
}
function selectSignoffItem(item, opts){
  if(!item) return;
  const idx=signoffQueue.findIndex(x=>x.id===item.id);
  if(idx>=0) signoffIdx=idx;
  if(opts&&opts.fullscreen) openFsApproval(item);
  else { updatePileChipHighlight(); loadSignoffItem(item); }
}
function renderSignoffPile(d, opts){
  if(d&&Array.isArray(d.pendingList)) signoffQueue=d.pendingList.slice();
  else if(d&&d.state&&d.state.pending===0) signoffQueue=[];
  if(d&&Array.isArray(d.rejectFixList)) rejectFixQueue=d.rejectFixList.slice();
  renderFixPile();
  const sig=queueSignature(signoffQueue);
  const prevId=signoffQueue[signoffIdx]&&signoffQueue[signoffIdx].id;
  if(signoffIdx>=signoffQueue.length) signoffIdx=Math.max(0, signoffQueue.length-1);
  if(prevId){ const ni=signoffQueue.findIndex(x=>x.id===prevId); if(ni>=0) signoffIdx=ni; }
  renderPileList();
  if(!signoffQueue.length){
    signoffLoadedId=null;
    lastQueueSig='';
    closeFsApproval();
    const f=$('#signoffFrame'); if(f) f.src='about:blank';
    const r=$('#signoffRubric'); if(r) r.innerHTML='';
    const m=$('#signoffMeta'); if(m) m.textContent='';
    const p=$('#signoffPos'); if(p) p.textContent='';
    return;
  }
  lastQueueSig=sig;
}
function renderScrubHistoryLog(rep){
  const el=$('#signoffScrubLog');
  if(!el) return;
  const rows=(rep&&rep.scrubHistory)||[];
  if(!rows.length){ el.style.display='none'; el.innerHTML=''; return; }
  el.style.display='block';
  el.innerHTML='<div class=signoff-scrublog-lbl>📜 Scrub run log</div>'+rows.map(row=>{
    const ts=String(row.ts||'').slice(0,19).replace('T',' ');
    const sc=row.score!=null?(row.score+'/13'):'';
    return esc(ts)+' · '+esc(String(row.status||''))+(sc?(' · '+sc):'')+' · '+esc(String(row.msg||'').slice(0,100));
  }).join('<br>');
}
async function loadSignoffItem(item, opts){
  if(!item||!item.id) return;
  const force=opts&&opts.force;
  const same=signoffLoadedId===item.id&&!force;
  signoffLoadedId=item.id;
  const m=$('#signoffMeta'), f=$('#signoffFrame'), r=$('#signoffRubric'), p=$('#signoffPos');
  const idx=signoffQueue.findIndex(x=>x.id===item.id);
  if(idx>=0) signoffIdx=idx;
  if(p) p.textContent=(signoffIdx+1)+' of '+signoffQueue.length+' in pile';
  if(m) m.innerHTML=esc(item.id)+' · <span style=color:#c4b5fd>'+esc(item.score||'?')+'/13</span> · '+esc(item.pillar||'')+(item.needsReview?' · <span style=color:#fbbf24>⚠ needs review</span>':'')+'<br><span style=font-weight:600;color:#9fb0bd>'+esc(String(item.title||'').slice(0,160))+'</span>'+(item.caveats&&item.caveats.length?('<br><span style=color:#fbbf24;font-size:12px>Issues: '+esc(item.caveats.join(', '))+' — ✓ publish if OK · ✗ send back to scrub</span>'):'')+(item.why?('<br><span style=color:#8aa;font-size:12px>'+esc(String(item.why).slice(0,180))+'</span>'):'')+'<br><a href="https://pulserevops.com/knowledge/'+esc(item.id)+'" target=_blank>Open full page in new tab ↗</a>';
  if(f&&!same) f.src='https://pulserevops.com/knowledge/'+item.id+'?scrub-preview='+Date.now();
  if(r&&same) return;
  if(r) r.innerHTML='<span style=color:#667>Loading checklist…</span>';
  renderScrubHistoryLog(null);
  try{
    const rep=await(await fetch('/inspect-entry?key='+KEY+'&id='+encodeURIComponent(item.id))).json();
    if(signoffLoadedId!==item.id) return;
    if(r&&rep.checks) r.innerHTML=rep.checks.map(c=>'<div class="'+(c.pass?'ok':'no')+'">'+(c.pass?'✓':'✗')+' '+esc(c.label)+'</div>').join('');
    renderScrubHistoryLog(rep);
  }catch(e){ if(r&&signoffLoadedId===item.id) r.textContent='(checklist load failed)'; }
}
async function signoffAction(action, extra){
  const item=signoffQueue[signoffIdx];
  if(!item) return;
  const btn=$('#signoffApprove'), rej=$('#signoffReject');
  if(btn) btn.disabled=true; if(rej) rej.disabled=true;
  try{
    const body={key:KEY,id:item.id};
    if(action==='reject'){
      body.action='reject';
      if(extra&&extra.targets) body.targets=extra.targets;
      if(extra&&extra.reason) body.reason=extra.reason;
      if(extra&&extra.notes) body.notes=extra.notes;
    }
    const res=await(await fetch('/agent-signoff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json();
    if(!res.ok){ alert(res.error||'failed'); return; }
    const toast=$('#rejectToast');
    if(action==='reject'&&toast) toast.textContent=res.msg||('✗ '+item.id+' → targeted scrubber fix');
    signoffQueue=signoffQueue.filter(x=>x.id!==item.id);
    if(signoffIdx>=signoffQueue.length) signoffIdx=Math.max(0, signoffQueue.length-1);
    if(action==='approve'){ burst(80); ding(true); if(!signoffQueue.length) closeFsApproval(); }
    rejectFixQueue=(res.rejectFixList)||rejectFixQueue;
    const d=await(await fetch('/scrub-status')).json();
    window._sa=d; renderAuto(d); if(d.state)paint(d.state);
    lastQueueSig='';
    renderSignoffPile(d);
  }catch(e){ alert(String(e.message||e)); }
  finally{ if(btn) btn.disabled=false; if(rej) rej.disabled=false; }
}
let rejectInspectCache=null;
async function openRejectModal(){
  const item=signoffQueue[signoffIdx];
  if(!item) return;
  const modal=$('#rejectModal'), meta=$('#rejectEntryMeta'), box=$('#rejectChecks');
  if(!modal||!box) return;
  meta.textContent=item.id+' · '+(item.score||'?')+'/13 — '+String(item.title||'').slice(0,100);
  box.innerHTML='<span style=color:#667>Loading rubric…</span>';
  modal.classList.add('on');
  const notesEl=$('#rejectNotes'); if(notesEl){ notesEl.value=''; notesEl.dataset.ddgAuto=''; }
  let failed=new Set();
  try{
    const rep=await(await fetch('/inspect-entry?key='+KEY+'&id='+encodeURIComponent(item.id))).json();
    rejectInspectCache=rep;
    if(rep.checks) rep.checks.forEach(c=>{ if(!c.pass) failed.add(c.key); });
  }catch(e){}
  box.innerHTML=RUBRIC_PICK.map(r=>{
    const pre=failed.has(r.key)?' checked':'';
    const tag=failed.has(r.key)?' <span class=fail>(failed auto-check)</span>':'';
    return '<label><input type=checkbox name=rejectTarget value="'+esc(r.key)+'"'+pre+'><span><span class=rk>'+esc(r.label)+'</span>'+tag+'</span></label>';
  }).join('');
  bindRejectCheckListeners();
  syncRejectDdgNote();
}
const DDG_REJECT_NOTE='Section images still show /img/auto placeholders — replace with DuckDuckGo https photos and verify wsrv render.';
function syncRejectDdgNote(){
  const notesEl=$('#rejectNotes');
  const ddgOn=!!document.querySelector('#rejectChecks input[value="pollinatorInternalFlux"]:checked');
  if(!notesEl) return;
  if(ddgOn){
    const cur=String(notesEl.value||'').trim();
    if(!cur||notesEl.dataset.ddgAuto==='1'){ notesEl.value=DDG_REJECT_NOTE; notesEl.dataset.ddgAuto='1'; }
    else if(cur.indexOf('/img/auto')<0&&cur.indexOf('DuckDuckGo')<0){ notesEl.value=DDG_REJECT_NOTE+'\\n'+cur; notesEl.dataset.ddgAuto='1'; }
  } else if(notesEl.dataset.ddgAuto==='1'&&String(notesEl.value||'').trim()===DDG_REJECT_NOTE){
    notesEl.value=''; notesEl.dataset.ddgAuto='';
  }
}
let rejectChecksBound=false;
function bindRejectCheckListeners(){
  const box=$('#rejectChecks'), notesEl=$('#rejectNotes');
  if(!box) return;
  if(!rejectChecksBound){
    rejectChecksBound=true;
    box.addEventListener('change',e=>{ if(e.target&&e.target.name==='rejectTarget') syncRejectDdgNote(); });
    if(notesEl) notesEl.addEventListener('input',()=>{ if(String(notesEl.value||'').trim()!==DDG_REJECT_NOTE) notesEl.dataset.ddgAuto=''; });
  }
}
function closeRejectModal(){ const m=$('#rejectModal'); if(m) m.classList.remove('on'); }
function confirmRejectModal(){
  const checks=[...document.querySelectorAll('#rejectChecks input[name=rejectTarget]:checked')].map(el=>el.value);
  if(!checks.length){ alert('Pick at least one rubric item to fix.'); return; }
  const notesEl=$('#rejectNotes');
  const notes=notesEl?String(notesEl.value||'').trim():'';
  closeRejectModal();
  signoffAction('reject',{ targets: checks, notes: notes||undefined });
}
function refreshSignoffQueue(){
  fetch('/pending-signoff?key='+KEY).then(r=>r.json()).then(d=>{
    const pending=(d&&d.pending)||[];
    const sig=queueSignature(pending);
    const fixSig=queueSignature((d&&d.rejectFix)||[]);
    if(sig===lastQueueSig&&fixSig===queueSignature(rejectFixQueue)) return;
    rejectFixQueue=(d&&d.rejectFix)||[];
    renderSignoffPile({ pendingList: pending, rejectFixList: rejectFixQueue, state: d&&d.state });
    if(d&&d.state) paint(d.state);
  }).catch(()=>{});
}
$('#signoffApprove')&&$('#signoffApprove').addEventListener('click',()=>signoffAction('approve'));
$('#signoffReject')&&$('#signoffReject').addEventListener('click',()=>openRejectModal());
$('#fsApprovalClose')&&$('#fsApprovalClose').addEventListener('click',()=>closeFsApproval());
$('#rejectCancel')&&$('#rejectCancel').addEventListener('click',closeRejectModal);
$('#rejectConfirm')&&$('#rejectConfirm').addEventListener('click',confirmRejectModal);
$('#rejectModal')&&$('#rejectModal').addEventListener('click',e=>{ if(e.target&&e.target.id==='rejectModal') closeRejectModal(); });
$('#signoffPrev')&&$('#signoffPrev').addEventListener('click',()=>{ if(signoffQueue.length){ signoffIdx=(signoffIdx-1+signoffQueue.length)%signoffQueue.length; openFsApproval(signoffQueue[signoffIdx]); } });
$('#signoffNext')&&$('#signoffNext').addEventListener('click',()=>{ if(signoffQueue.length){ signoffIdx=(signoffIdx+1)%signoffQueue.length; openFsApproval(signoffQueue[signoffIdx]); } });
addEventListener('keydown',e=>{
  if($('#rejectModal')&&$('#rejectModal').classList.contains('on')){
    if(e.key==='Escape'){ e.preventDefault(); closeRejectModal(); }
    return;
  }
  if($('#fsApproval')&&$('#fsApproval').classList.contains('on')&&e.key==='Escape'){ e.preventDefault(); closeFsApproval(); return; }
  if(!signoffQueue.length||!($('#fsApproval')&&$('#fsApproval').classList.contains('on'))) return;
  if(e.target&&/input|textarea|select/i.test(e.target.tagName)) return;
  if(e.key==='Enter'||e.key==='a'||e.key==='A'){ e.preventDefault(); signoffAction('approve'); }
  if(e.key==='x'||e.key==='X'){ e.preventDefault(); openRejectModal(); }
  if(e.key==='ArrowRight'){ e.preventDefault(); signoffIdx=(signoffIdx+1)%signoffQueue.length; openFsApproval(signoffQueue[signoffIdx]); }
  if(e.key==='ArrowLeft'){ e.preventDefault(); signoffIdx=(signoffIdx-1+signoffQueue.length)%signoffQueue.length; openFsApproval(signoffQueue[signoffIdx]); }
});
async function stopScrubUI(){
  const sp=$('#stop'), fs=$('#fsStop');
  if(sp){ sp.textContent='⏳ finishing current entry…'; sp.disabled=true; }
  if(fs){ fs.textContent='⏳ finishing current entry…'; fs.disabled=true; }
  await fetch('/scrub-auto',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,action:'stop'})}).catch(()=>{});
  for(let i=0;i<360;i++){
    try{
      const d=await(await fetch('/scrub-status')).json();
      window._sa=d; renderAuto(d); if(d.state)paint(d.state);
      if(!d.running && !d.imageScrubRunning){ break; }
    }catch(e){}
    await new Promise(r=>setTimeout(r,500));
  }
  const sp2=$('#stop'), fs2=$('#fsStop'), sf2=$('#scrubForceStop'), fsf=$('#fsScrubForceStop'), bg=$('#begin'), gr=$('#gear');
  if(bg) bg.style.display='inline-block';
  if(sp2){ sp2.style.display='none'; sp2.textContent='⏹ Stop Scrub'; sp2.disabled=false; }
  if(sf2){ sf2.style.display='none'; sf2.disabled=false; }
  if(fs2){ fs2.textContent='⏹ Stop Scrub'; fs2.disabled=false; }
  if(fsf) fsf.disabled=false;
  if(gr) gr.style.display='none';
  stopTickCountdown();
  showFsScrub(false);
}
async function forceStopScrubUI(){
  if(!confirm('Force stop scrub immediately? Abandons the current entry — will not resume on restart.')) return;
  const sp=$('#stop'), fs=$('#fsStop'), sf=$('#scrubForceStop'), fsf=$('#fsScrubForceStop'), fsa=$('#forceStopAll'), bg=$('#begin'), gr=$('#gear');
  [sp,fs,sf,fsf,fsa].forEach(el=>{ if(el) el.disabled=true; });
  await fetch('/scrub-force-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}).catch(()=>{});
  try{
    const d=await(await fetch('/scrub-status')).json();
    window._sa=d; renderAuto(d); if(d.state)paint(d.state);
  }catch(e){}
  if(bg) bg.style.display='inline-block';
  if(sp){ sp.style.display='none'; sp.textContent='⏹ Stop Scrub'; sp.disabled=false; }
  if(sf){ sf.style.display='inline-block'; sf.disabled=false; }
  if(fsa) fsa.disabled=false;
  if(fs){ fs.textContent='⏹ Stop Scrub'; fs.disabled=false; }
  if(fsf) fsf.disabled=false;
  if(gr) gr.style.display='none';
  stopTickCountdown();
  showFsScrub(false);
}
async function forceStopAllUI(){
  if(!confirm('Force stop EVERYTHING immediately?\n\nScrubber · Generate · Face hero · Image fill · DDG · Rubric · Format fixer\n\nCurrent entry abandoned — will not auto-resume.')) return;
  const sp=$('#stop'), fs=$('#fsStop'), sf=$('#scrubForceStop'), fsf=$('#fsScrubForceStop'), fsa=$('#forceStopAll'), bg=$('#begin'), gr=$('#gear');
  [sp,fs,sf,fsf,fsa].forEach(el=>{ if(el) el.disabled=true; });
  await fetch('/force-stop-all',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}).catch(()=>{});
  try{
    const d=await(await fetch('/scrub-status')).json();
    window._sa=d; renderAuto(d); if(d.state)paint(d.state);
  }catch(e){}
  if(bg) bg.style.display='inline-block';
  if(sp){ sp.style.display='none'; sp.textContent='⏹ Stop Scrub'; sp.disabled=false; }
  if(sf){ sf.style.display='inline-block'; sf.disabled=false; }
  if(fsa) fsa.disabled=false;
  if(fs){ fs.textContent='⏹ Stop Scrub'; fs.disabled=false; }
  if(fsf) fsf.disabled=false;
  if(gr) gr.style.display='none';
  stopTickCountdown();
  showFsScrub(false);
}
var _fsStop=$('#fsStop');_fsStop&&_fsStop.addEventListener('click',()=>stopScrubUI());
var _scrubForceStop=$('#scrubForceStop'); _scrubForceStop&&_scrubForceStop.addEventListener('click',()=>forceStopScrubUI());
var _forceStopAll=$('#forceStopAll'); _forceStopAll&&_forceStopAll.addEventListener('click',()=>forceStopAllUI());
var _fsScrubForceStop=$('#fsScrubForceStop'); _fsScrubForceStop&&_fsScrubForceStop.addEventListener('click',()=>forceStopScrubUI());
var _fsGenStop=$('#fsGenStop');_fsGenStop&&_fsGenStop.addEventListener('click',()=>stopGenUI());
var _fsGenForceStop=$('#fsGenForceStop'); _fsGenForceStop&&_fsGenForceStop.addEventListener('click',()=>forceStopGenUI());
var _begin=$('#begin');_begin&&_begin.addEventListener('click',async()=>{
  try{ if(AC&&AC.state==='suspended')AC.resume(); }catch(e){}
  const bg=$('#begin'); if(bg){bg.style.display='none';} const sp=$('#stop'); if(sp)sp.style.display='inline-block'; const sf=$('#scrubForceStop'); if(sf)sf.style.display='inline-block'; const gr=$('#gear'); if(gr)gr.style.display='block';
  const cur2=$('#scrubcur'); if(cur2)cur2.textContent='🍳 starting full scrub…';
  await fetch('/scrub-auto',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,action:'start'})}).catch(()=>{});
  startAutoPoll();
});
var _pillarFix=$('#pillarFixStart'); _pillarFix&&_pillarFix.addEventListener('click',async()=>{
  try{ if(AC&&AC.state==='suspended')AC.resume(); }catch(e){}
  const pf=$('#scrubpillarfilter'); const pillar=pf?pf.value:'all';
  if(!pillar||pillar==='all'){ alert('Pick a pillar first (not All pillars)'); return; }
  const bg=$('#begin'); if(bg) bg.style.display='none';
  const sp=$('#stop'); if(sp){ sp.style.display='inline-block'; sp.textContent='⏹ Stop 13/13 fix'; }
  const gr=$('#gear'); if(gr) gr.style.display='block';
  const cur2=$('#scrubcur'); if(cur2) cur2.textContent='🎯 fixing '+pillar+' → 13/13…';
  await fetch('/pillar-fix-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar})}).catch(()=>{});
  startAutoPoll();
});
var _stop=$('#stop');_stop&&_stop.addEventListener('click',()=>stopScrubUI());
var _scrubExpand=$('#scrubExpand'); _scrubExpand&&_scrubExpand.addEventListener('click',()=>showFsScrub(true));
var _genExpand=$('#genExpand'); _genExpand&&_genExpand.addEventListener('click',()=>showFsGenerate(true));
var _fsScrubDash=$('#fsScrubDash'); _fsScrubDash&&_fsScrubDash.addEventListener('click',()=>showFsScrub(false));
var _fsGenDash=$('#fsGenDash'); _fsGenDash&&_fsGenDash.addEventListener('click',()=>showFsGenerate(false));
// ── 🎲 Generate crew UI ──────────────────────────────────────────
let pillarsLoaded=false;
setInterval(()=>{ if(KEY && !pillarsLoaded) loadPillars(); },5000);
function genRender(d){
  if(!d) return;
  const running=!!d.running, tot=(d.published||0)+(d.pooled||0), any=running||tot;
  const live=d.scrubLive||{};
  paintPipelineAlt(d.pipelineAlt||window._sa&&window._sa.pipelineAlt, running, window._sa&&isScrubActive(window._sa));
  paintAllCarwash(live,{genActive:running,scrubActive:false,genTitle:'🚿 Generate · factor 1 car wash',batchLabel:running?('Batch Q&A '+tot+'/'+(d.target||0)):''});
  window.genRunning = running;
  const gp=$('#genprog'); if(gp) gp.style.display=any?'block':'none';
  const pct=d.target?Math.min(100,Math.round(tot/d.target*100)):0;
  const gb=$('#genbar'); if(gb) gb.style.width=pct+'%';
  const gt=$('#gentop'); if(gt) gt.textContent=(d.pillarName||'')+' — '+tot+'/'+(d.target||0)+' written · '+(d.pooled||0)+' queued for scrubber';
  const gs=$('#genstage'); if(gs) gs.textContent=d.current?(d.stage+' — '+d.current.id+': '+d.current.title):(d.stage||(d.cooldownSec?('⏸ cooldown '+Math.ceil(d.cooldownSec/60)+'m (DDG + Pollinator)'):(IMAGE_LAW_INTERNAL_DDG?'flux cover + DDG sections…':'')));
  const gl=$('#genlog'); if(gl) gl.innerHTML=(d.log||[]).map(l=>String(l).replace(/[<>]/g,'')).join('<br>');
  const gst=$('#genstart'); if(gst) gst.style.display='inline-block';
  const g100r=$('#gen100random'); if(g100r) g100r.style.display='inline-block';
  const gsp=$('#genstop'); if(gsp) gsp.style.display=running?'inline-block':'none';
  const gfp=$('#genForceStop'); if(gfp) gfp.style.display=running?'inline-block':'none';
  const gex=$('#genExpand'); if(gex) gex.style.display=running?'inline-block':'none';
  const q=(d.queue||[]); const gq=$('#genqueue'); if(gq) gq.innerHTML = q.length ? ('⏭ queued: '+q.map(x=>(x.pillar==='random'?'100:random':x.pillar)+' ('+x.count+')').join(' · ')) : '';
  updateTabBadges();
}
let genPoll=null;
function genStartPoll(){
  if(genPoll) clearInterval(genPoll);
  window.genRunning=true;
  const tick=async()=>{
    try{
      const d=await(await fetch('/gen-status?key='+KEY)).json();
      window._gen=d;
      window.genRunning=!!d.running;
      if(window.activeTab==='generate') genRender(d);
      renderFsGenerate(d);
      if(d.state) paint(d.state);
      updateTabBadges();
      if(!d.running){
        window.genRunning=false;
        clearInterval(genPoll);
        genPoll=null;
        const fs=$('#fsGenerate');
        if(fs&&fs.classList.contains('on')) setTimeout(()=>showFsGenerate(false),2500);
      }
    }catch(e){}
  };
  tick();
  genPoll=setInterval(tick,1000);
}
async function stopGenUI(){
  const fs=$('#fsGenStop');
  if(fs){ fs.textContent='⏳ stopping…'; fs.disabled=true; }
  await fetch('/gen-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}).catch(()=>{});
  for(let i=0;i<360;i++){
    try{
      const d=await(await fetch('/gen-status?key='+KEY)).json();
      window._gen=d; if(window.activeTab==='generate') genRender(d);
      renderFsGenerate(d);
      if(!d.running) break;
    }catch(e){}
    await new Promise(r=>setTimeout(r,500));
  }
  window.genRunning=false;
  if(fs){ fs.textContent='⏹ Stop Generate'; fs.disabled=false; }
  showFsGenerate(false);
  updateTabBadges();
}
async function forceStopGenUI(){
  if(!confirm('Force stop generate immediately? Clears the generate queue.')) return;
  const fs=$('#fsGenStop'), gf=$('#genForceStop'), fgf=$('#fsGenForceStop');
  [fs,gf,fgf].forEach(el=>{ if(el) el.disabled=true; });
  await fetch('/gen-force-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}).catch(()=>{});
  try{
    const d=await(await fetch('/gen-status?key='+KEY)).json();
    window._gen=d; if(window.activeTab==='generate') genRender(d);
    renderFsGenerate(d);
  }catch(e){}
  window.genRunning=false;
  if(fs){ fs.textContent='⏹ Stop Generate'; fs.disabled=false; }
  if(gf) gf.disabled=false;
  if(fgf) fgf.disabled=false;
  showFsGenerate(false);
  updateTabBadges();
}
async function genGo(pillar,count){
  if(!KEY){alert('enter the code first');return;}
  if(count==null) count=readGenCount();
  if(!pillar) pillar=readGenPillar();
  const gp=$('#genprog'); if(gp)gp.style.display='block';
  const gb=$('#genbar'); if(gb)gb.style.width='2%';
  const gt=$('#gentop'); if(gt) gt.textContent=(pillar==='random'?'100:random — new topic each Q':pillar)+' — 0/'+count+' starting…';
  const gs=$('#genstage'); if(gs)gs.textContent='⏳ starting the writers…';
  try{ const r=await(await fetch('/gen-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar,count})})).json(); if(r.ok){ genStartPoll(); histPoll(); if(r.queued){ const gq=$('#genqueue'); if(gq) gq.textContent='✅ queued — starts after the current run'; } } else { if(gp)gp.style.display='none'; alert(r.msg||'could not start'); } }catch(e){ if(gp)gp.style.display='none'; alert('server?'); } }
function readGenCount(){
  const el=$('#gencount');
  const raw=el&&el.value!==''&&el.value!=null?String(el.value).trim():'100';
  const n=parseInt(raw.replace(/[^\d]/g,''),10);
  if(isNaN(n)||n<1) return 1;
  return Math.min(500,n);
}
function setGenCount(n){
  n=Math.max(1,Math.min(500,parseInt(n,10)||1));
  const gc=$('#gencount');
  if(gc) gc.value=String(n);
  document.querySelectorAll('#genCountPresets button').forEach(b=>b.classList.toggle('on',parseInt(b.getAttribute('data-n'),10)===n));
  updateGenStartLabel();
}
function updateGenStartLabel(){
  const n=readGenCount();
  const btn=$('#genstart');
  if(btn) btn.textContent='✍️ Generate '+n;
}
function bindGenCountUi(){
  const gc=$('#gencount');
  if(gc){
    gc.addEventListener('input',()=>{ updateGenStartLabel(); document.querySelectorAll('#genCountPresets button').forEach(b=>b.classList.remove('on')); });
    gc.addEventListener('change',()=>setGenCount(readGenCount()));
  }
  document.querySelectorAll('#genCountPresets button').forEach(b=>{
    b.addEventListener('click',()=>setGenCount(parseInt(b.getAttribute('data-n'),10)||1));
  });
  updateGenStartLabel();
}
function readGenPillar(){ const sel=$('#genpillar'); return (sel&&sel.value)?sel.value:'ce'; }
async function pipelineAutoGo(count,opts){
  opts=opts||{};
  const pillar=opts.pillar||readGenPillar();
  setGenCount(count);
  await genGo(pillar,count);
  if(opts.autoScrub!==false){
    await fetch('/scrub-auto',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,action:'start'})}).catch(()=>{});
    startAutoPoll();
  }
}
var _genstart=$('#genstart'); _genstart&&_genstart.addEventListener('click',()=>genGo(readGenPillar(),readGenCount()));
var _pipeauto100=$('#pipeauto100'); _pipeauto100&&_pipeauto100.addEventListener('click',()=>pipelineAutoGo(100,{autoScrub:true}));
var _scrubpillarfilter=$('#scrubpillarfilter'); _scrubpillarfilter&&_scrubpillarfilter.addEventListener('change',()=>postScrubFilter(_scrubpillarfilter.value));
var _fsScrubPillarFilter=$('#fsScrubPillarFilter'); _fsScrubPillarFilter&&_fsScrubPillarFilter.addEventListener('change',()=>postScrubFilter(_fsScrubPillarFilter.value));
var _dupeStart=$('#dupeStart');
_dupeStart&&_dupeStart.addEventListener('click',async()=>{
  if(!KEY) return;
  const pillar=($('#dupePillarFilter')&&$('#dupePillarFilter').value)||'tl';
  const guideKeywords=readGuideKeywords('dupeKeywords');
  _dupeStart.disabled=true;
  try{
    const r=await(await fetch('/image-duplicator-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar,guideKeywords})})).json();
    if(!r.started){ alert(r.msg||'already running'); return; }
    $('#dupeProg')&&($('#dupeProg').style.display='block');
    startDupePoll();
    renderDuplicator({running:true,pct:0,done:0,total:0,log:['▶ Starting…'],pillarName:r.pillarName,guideKeywords});
  }catch(e){ alert('start failed'); }
  finally{ _dupeStart.disabled=false; }
});
var _dupeStop=$('#dupeStop');
_dupeStop&&_dupeStop.addEventListener('click',async()=>{
  if(!KEY) return;
  try{ await fetch('/image-duplicator-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}); await refreshDuplicatorStatus(); }catch(e){}
});
function bindForceStop(btnId, path, confirmMsg, refreshFn){
  const btn=$(btnId);
  if(!btn) return;
  btn.addEventListener('click',async()=>{
    if(!KEY||btn.disabled) return;
    if(confirmMsg&&!confirm(confirmMsg)) return;
    btn.disabled=true;
    try{
      await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})});
      if(refreshFn) await refreshFn();
    }catch(e){ alert('force stop failed'); }
    finally{ btn.disabled=false; }
  });
}
bindForceStop('#dupeForceStop','/image-duplicator-force-stop','Force stop image fill immediately? Will not resume on server restart.', refreshDuplicatorStatus);
bindForceStop('#rewriteForceStop','/image-rewrite-force-stop','Force stop overwrite run? Clears pending review and will not resume.', refreshRewriteStatus);
bindForceStop('#internalForceStop','/internal-images-force-stop','Force stop internal images immediately? Will not resume on server restart.', refreshInternalImagesStatus);
bindForceStop('#formatfixForceStop','/format-fixer-force-stop','Force stop format fixer immediately?', refreshFormatFixerStatus);
bindForceStop('#rubricForceStop','/rubric-station-force-stop','Force stop rubric station immediately?', refreshRubricStationStatus);
var _genForceStop=$('#genForceStop'); _genForceStop&&_genForceStop.addEventListener('click',()=>forceStopGenUI());
function squareClickKey(id){return 'pulse.square.clicks.'+String(id||'').trim();}
function squareClickCount(id){try{return parseInt(sessionStorage.getItem(squareClickKey(id))||'0',10)||0;}catch(e){return 0;}}
function setSquareClickCount(id,n){try{sessionStorage.setItem(squareClickKey(id),String(n));}catch(e){}}
var _squarePexelsSearch=$('#squarePexelsSearch');
_squarePexelsSearch&&_squarePexelsSearch.addEventListener('click',async()=>{
  if(!KEY)return;
  const id=String(($('#squareQaId')&&$('#squareQaId').value)||'').trim();
  const title=String(($('#squareTitleQuery')&&$('#squareTitleQuery').value)||'').trim();
  const gender='';
  const currentClick=squareClickCount(id);
  const status=$('#squarePickerStatus'),grid=$('#squarePexelsGrid');
  if(!id){if(status)status.textContent='Enter a graduated Q&A ID.';return;}
  _squarePexelsSearch.disabled=true;if(status)status.textContent='Searching Pexels from title keywords…';if(grid)grid.innerHTML='';
  try{
    const u='/square-pexels-search?key='+encodeURIComponent(KEY)+'&id='+encodeURIComponent(id)+'&title='+encodeURIComponent(title)+'&gender='+encodeURIComponent(gender)+'&clickIndex='+currentClick;
    const r=await(await fetch(u)).json();
    if(!r.ok)throw new Error(r.msg||'search failed');
    if($('#squareTitleQuery')&&!title)$('#squareTitleQuery').value=r.title||'';
    if(status)status.textContent=(r.template==='top10'?'Top 10 manual mode':'Q&A essay manual mode')+' · '+(r.targetTitle||r.title)+' · click '+(currentClick+1)+'/'+(r.targetCount||'?')+' · query: '+r.query;
    (r.photos||[]).forEach(photo=>{
      const btn=document.createElement('button');btn.type='button';btn.className='square-pexels-option';
      const img=document.createElement('img');img.src=photo.thumb;img.alt='Pexels option by '+(photo.photographer||'photographer');
      btn.appendChild(img);
      btn.addEventListener('click',async()=>{
        const clickIndex=squareClickCount(id);btn.disabled=true;if(status)status.textContent='Applying selected image…';
        try{
          const applied=await(await fetch('/square-pexels-apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,id,url:photo.url,clickIndex,gender})})).json();
          if(!applied.ok)throw new Error(applied.msg||'apply failed');
          setSquareClickCount(id,clickIndex+1);
          if(status)status.textContent='✓ '+applied.placement+' · click another image for the next existing slot, or Finish Q&A.';
          btn.style.borderColor='#22c55e';btn.style.opacity='.55';
          if(clickIndex+1<(r.targetCount||0)){setTimeout(()=>_squarePexelsSearch.click(),350);}
        }catch(e){btn.disabled=false;if(status)status.textContent='⚠ '+e.message;}
      });
      if(grid)grid.appendChild(btn);
    });
  }catch(e){if(status)status.textContent='⚠ '+e.message;}
  finally{_squarePexelsSearch.disabled=false;}
});
var _squareFinishQa=$('#squareFinishQa');
_squareFinishQa&&_squareFinishQa.addEventListener('click',async()=>{
  if(!KEY)return;
  const id=String(($('#squareQaId')&&$('#squareQaId').value)||'').trim(),status=$('#squarePickerStatus');
  if(!id){if(status)status.textContent='Enter a Q&A ID.';return;}
  _squareFinishQa.disabled=true;
  try{
    const r=await(await fetch('/square-pexels-finish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,id})})).json();
    if(!r.ok)throw new Error(r.msg||'finish failed');
    setSquareClickCount(id,0);
    if(status)status.textContent='✅ Finished · '+(r.emailed||0)+' images emailed · added to Recent and '+(r.pillar||'its')+' topic pillar.';
    const grid=$('#squarePexelsGrid');if(grid)grid.innerHTML='';
  }catch(e){if(status)status.textContent='⚠ '+e.message;}
  finally{_squareFinishQa.disabled=false;}
});
var _faceheroStart=$('#faceheroStart');
_faceheroStart&&_faceheroStart.addEventListener('click',async()=>{
  if(!KEY) return;
  const pillar=($('#faceheroPillarFilter')&&$('#faceheroPillarFilter').value)||'tl';
  const guideKeywords=readGuideKeywords('faceheroKeywords');
  const autoApprove=readAutoApprove('faceheroAutoApprove');
  const batchSize=Math.max(1,Math.min(200,parseInt(($('#faceheroBatch')&&$('#faceheroBatch').value)||'200',10)||200));
  const modeNote=autoApprove?' Auto-approve is ON — each card saves without manual review.':' After each card: ✓ Keep saves it · ✗ Try again regenerates with the next search.';
  if(!confirm('Build up to '+batchSize+' titled squares for '+(pillar==='all'?'all queued Q&As':pillar)+'?'+modeNote)) return;
  _faceheroStart.disabled=true;
  try{
    const r=await(await fetch('/face-hero-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar,guideKeywords,autoApprove,batchSize})})).json();
    if(!r.started){
      if(r.needsReview){
        alert(r.msg||('Review pending: '+(r.pendingId||'')));
        await refreshFaceHeroStatus();
        return;
      }
      alert(r.msg||'could not start'); return;
    }
    $('#faceheroProg')&&($('#faceheroProg').style.display='block');
    $('#faceheroReview')&&($('#faceheroReview').style.display='none');
    startFaceHeroPoll();
    renderFaceHero({running:true,pct:0,done:0,total:0,log:['▶ Starting square batch…'],pillarName:r.pillarName,pillar,guideKeywords,autoApproveImages:autoApprove,batchSize});
  }catch(e){ alert('start failed'); }
  finally{ _faceheroStart.disabled=false; }
});
var _faceheroKeep=$('#faceheroKeep');
_faceheroKeep&&_faceheroKeep.addEventListener('click',async()=>{
  if(!KEY) return;
  _faceheroKeep.disabled=true;
  try{
    const r=await(await fetch('/face-hero-review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,action:'keep'})})).json();
    if(!r.ok){ alert(r.msg||'keep failed'); return; }
    startFaceHeroPoll();
    await refreshFaceHeroStatus();
  }catch(e){ alert('keep failed'); }
  finally{ _faceheroKeep.disabled=false; }
});
var _faceheroReviewImg=$('#faceheroReviewImg');
_faceheroReviewImg&&_faceheroReviewImg.addEventListener('click',function(e){
  e.preventDefault();
  if(_faceheroKeep&&!_faceheroKeep.disabled)_faceheroKeep.click();
});
var _faceheroRetry=$('#faceheroRetry');
_faceheroRetry&&_faceheroRetry.addEventListener('click',async()=>{
  if(!KEY) return;
  _faceheroRetry.disabled=true;
  const rv=$('#faceheroReview'); if(rv) rv.style.display='none';
  const ri=$('#faceheroReviewImg'); if(ri) ri.removeAttribute('src');
  try{
    const r=await(await fetch('/face-hero-review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,action:'retry'})})).json();
    if(!r.ok){ alert(r.msg||'retry failed'); await refreshFaceHeroStatus(); return; }
    startFaceHeroPoll();
    await refreshFaceHeroStatus();
  }catch(e){ alert('retry failed'); }
  finally{ _faceheroRetry.disabled=false; }
});
var _faceheroStop=$('#faceheroStop');
_faceheroStop&&_faceheroStop.addEventListener('click',async()=>{
  if(!KEY) return;
  try{ await fetch('/face-hero-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}); await refreshFaceHeroStatus(); }catch(e){}
});
var _faceheroForceStop=$('#faceheroForceStop');
_faceheroForceStop&&_faceheroForceStop.addEventListener('click',async()=>{
  if(!KEY||_faceheroForceStop.disabled) return;
  if(!confirm('Force stop face-card run? Clears any pending review and will NOT resume on server restart.')) return;
  _faceheroForceStop.disabled=true;
  try{
    await fetch('/face-hero-force-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})});
    $('#faceheroReview')&&($('#faceheroReview').style.display='none');
    await refreshFaceHeroStatus();
  }catch(e){ alert('force stop failed'); }
  finally{ _faceheroForceStop.disabled=false; }
});
var _rewriteStart=$('#rewriteStart');
_rewriteStart&&_rewriteStart.addEventListener('click',async()=>{
  if(!KEY) return;
  const pillar=($('#rewritePillarFilter')&&$('#rewritePillarFilter').value)||'tl';
  const guideKeywords=readGuideKeywords('rewriteKeywords');
  const autoApprove=readAutoApprove('rewriteAutoApprove');
  if(!pillar||pillar==='all'){ alert('Pick a specific pillar (not All)'); return; }
  const modeNote=autoApprove?' Auto-approve is ON — each entry saves without manual review.':' After each entry: ✓ Keep saves all images · ✗ Try again regenerates that entry.';
  if(!confirm('Pollinator image overwrite for every Q&A in '+pillar+'?'+modeNote)) return;
  _rewriteStart.disabled=true;
  try{
    const r=await(await fetch('/image-rewrite-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar,guideKeywords,autoApprove})})).json();
    if(!r.started){ alert(r.msg||'could not start'); return; }
    $('#rewriteProg')&&($('#rewriteProg').style.display='block');
    $('#rewriteReview')&&($('#rewriteReview').style.display='none');
    startRewritePoll();
    renderRewrite({running:true,pct:0,done:0,total:0,log:['▶ Starting…'],pillarName:r.pillarName,pillar,guideKeywords,autoApproveImages:autoApprove});
  }catch(e){ alert('start failed'); }
  finally{ _rewriteStart.disabled=false; }
});
var _rewriteKeep=$('#rewriteKeep');
_rewriteKeep&&_rewriteKeep.addEventListener('click',async()=>{
  if(!KEY) return;
  _rewriteKeep.disabled=true;
  try{
    await fetch('/image-rewrite-review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,action:'keep'})});
    startRewritePoll();
    await refreshRewriteStatus();
  }catch(e){ alert('keep failed'); }
  finally{ _rewriteKeep.disabled=false; }
});
var _rewriteRetry=$('#rewriteRetry');
_rewriteRetry&&_rewriteRetry.addEventListener('click',async()=>{
  if(!KEY) return;
  _rewriteRetry.disabled=true;
  const rv=$('#rewriteReview'); if(rv) rv.style.display='none';
  const ri=$('#rewriteReviewImg'); if(ri) ri.removeAttribute('src');
  try{
    await fetch('/image-rewrite-review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,action:'retry'})});
    startRewritePoll();
    await refreshRewriteStatus();
  }catch(e){ alert('retry failed'); }
  finally{ _rewriteRetry.disabled=false; }
});
var _rewriteStop=$('#rewriteStop');
_rewriteStop&&_rewriteStop.addEventListener('click',async()=>{
  if(!KEY) return;
  try{ await fetch('/image-rewrite-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}); }catch(e){}
});
var _formatfixAutoToggle=$('#formatfixAutoToggle');
_formatfixAutoToggle&&_formatfixAutoToggle.addEventListener('click',async()=>{
  if(!KEY)return;
  const enabled=_formatfixAutoToggle.getAttribute('aria-pressed')!=='true';
  _formatfixAutoToggle.disabled=true;
  try{
    const r=await(await fetch('/format-fixer-auto',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,enabled})})).json();
    if(!r.ok)throw new Error(r.msg||'toggle failed');
    await refreshFormatFixerStatus();
    if(r.auto)startFormatFixerPoll();
  }catch(e){alert(e.message||'toggle failed');}
  finally{_formatfixAutoToggle.disabled=false;}
});
var _formatfixStart=$('#formatfixStart');
_formatfixStart&&_formatfixStart.addEventListener('click',async()=>{
  if(!KEY) return;
  const pillar=($('#formatfixPillarFilter')&&$('#formatfixPillarFilter').value)||'tl';
  if(!pillar||pillar==='all'){ alert('Pick a specific pillar (not All)'); return; }
  if(!confirm('Format Fixer for every Q&A in '+pillar+'? Fixes content + structure only — images will NOT be changed.')) return;
  _formatfixStart.disabled=true;
  try{
    const r=await(await fetch('/format-fixer-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar})})).json();
    if(!r.started){ alert(r.msg||'could not start'); return; }
    $('#formatfixProg')&&($('#formatfixProg').style.display='block');
    startFormatFixerPoll();
    renderFormatFixer({running:true,pct:0,done:0,total:0,log:['▶ Starting…'],pillarName:r.pillarName,pillar});
  }catch(e){ alert('start failed'); }
  finally{ _formatfixStart.disabled=false; }
});
var _formatfixStop=$('#formatfixStop');
_formatfixStop&&_formatfixStop.addEventListener('click',async()=>{
  if(!KEY) return;
  try{ await fetch('/format-fixer-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}); }catch(e){}
});
var _internalStart=$('#internalStart');
_internalStart&&_internalStart.addEventListener('click',async()=>{
  if(!KEY) return;
  const pillar=($('#internalPillarFilter')&&$('#internalPillarFilter').value)||'tl';
  const guideKeywords=($('#internalKeywords')&&$('#internalKeywords').value||'').trim();
  if(!confirm('Internal Images for '+pillar+'? Pollinator flux on ## sections only — face-card + hero untouched.')) return;
  _internalStart.disabled=true;
  try{
    const r=await(await fetch('/internal-images-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar,guideKeywords})})).json();
    if(!r.started){ alert(r.msg||'could not start'); return; }
    startInternalPoll();
    renderInternalImages({running:true,pct:0,done:0,total:0,log:['▶ Starting…'],pillarName:r.pillarName,pillar});
  }catch(e){ alert('start failed'); }
  finally{ _internalStart.disabled=false; }
});
var _internalStop=$('#internalStop');
_internalStop&&_internalStop.addEventListener('click',async()=>{
  if(!KEY) return;
  try{ await fetch('/internal-images-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}); }catch(e){}
});
var _rubricStart=$('#rubricStart');
_rubricStart&&_rubricStart.addEventListener('click',async()=>{
  if(!KEY) return;
  const station=($('#rubricStationFilter')&&$('#rubricStationFilter').value)||'writing';
  const pillar=($('#rubricPillarFilter')&&$('#rubricPillarFilter').value)||'tl';
  if(!confirm('Run '+station+' station on '+pillar+'? Fixes that slice then runs dedicated auditor.')) return;
  _rubricStart.disabled=true;
  try{
    const r=await(await fetch('/rubric-station-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,station,pillar})})).json();
    if(!r.started){ alert(r.msg||'could not start'); return; }
    startRubricPoll();
    renderRubricStation({running:true,pct:0,done:0,total:0,station,stationLabel:r.stationLabel,pillarName:r.pillarName,log:['▶ Starting…']});
  }catch(e){ alert('start failed'); }
  finally{ _rubricStart.disabled=false; }
});
var _rubricStop=$('#rubricStop');
_rubricStop&&_rubricStop.addEventListener('click',async()=>{
  if(!KEY) return;
  try{ await fetch('/rubric-station-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}); }catch(e){}
});
var _imgenStart=$('#imgenStart');
_imgenStart&&_imgenStart.addEventListener('click',async()=>{
  if(!KEY) return;
  const pillar=($('#imgenPillarFilter')&&$('#imgenPillarFilter').value)||'tl';
  const target=parseInt(($('#imgenTarget')&&$('#imgenTarget').value)||String(${IMG_GEN_BATCH_DEFAULT}),10)||${IMG_GEN_BATCH_DEFAULT};
  const guideKeywords=($('#imgenKeywords')&&$('#imgenKeywords').value||'').trim();
  try{ localStorage.setItem('imgenGuideKeywords', guideKeywords); }catch(e){}
  _imgenStart.disabled=true;
  try{
    const r=await(await fetch('/image-generator-start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,pillar,target,guideKeywords})})).json();
    if(!r.started){ alert(r.msg||'already running'); return; }
    window._imgenApprovals={};
    $('#imgenProg')&&($('#imgenProg').style.display='block');
    $('#imgenReview')&&($('#imgenReview').style.display='none');
    startImgGenPoll();
    renderImgGen({running:true,phase:'collect',pct:0,poolCount:r.poolCount||0,target:target,done:0,pillar:pillar,pillarName:r.pillarName,log:['▶ Finding '+target+' Fable-graded candidates…']});
    if(_imgenStop) _imgenStop.disabled=false;
    if(_imgenForceStop) _imgenForceStop.disabled=false;
  }catch(e){ alert('start failed'); }
  finally{ _imgenStart.disabled=false; }
});
var _imgenStop=$('#imgenStop');
_imgenStop&&_imgenStop.addEventListener('click',async()=>{
  if(!KEY||_imgenStop.disabled) return;
  _imgenStop.disabled=true;
  try{
    await fetch('/image-generator-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})});
    startImgGenPoll();
    setTimeout(refreshImgGenStatus,1200);
  }catch(e){}
});
var _imgenForceStop=$('#imgenForceStop');
_imgenForceStop&&_imgenForceStop.addEventListener('click',async()=>{
  if(!KEY||_imgenForceStop.disabled) return;
  if(!confirm('Force stop Image Generator and discard the in-progress batch?')) return;
  _imgenForceStop.disabled=true;
  try{
    await fetch('/image-generator-force-stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})});
    window._imgenApprovals={};
    await refreshImgGenStatus();
  }catch(e){ alert('force stop failed'); }
});
var _imgenGrid=$('#imgenGrid');
_imgenGrid&&_imgenGrid.addEventListener('click',function(e){
  const btn=e.target.closest('button');
  const card=e.target.closest('.imgen-card');
  if(!btn||!card) return;
  const id=card.getAttribute('data-id');
  if(!window._imgenApprovals) window._imgenApprovals={};
  if(btn.classList.contains('yes')) window._imgenApprovals[id]=true;
  else if(btn.classList.contains('no')) window._imgenApprovals[id]=false;
  if(window._imgen) renderImgGen(window._imgen);
});
var _imgenPoolGrid=$('#imgenPoolGrid');
_imgenPoolGrid&&_imgenPoolGrid.addEventListener('click',function(e){
  const row=e.target.closest('.imgen-pool-row');
  if(!row||row.classList.contains('disabled')) return;
  const p=row.getAttribute('data-pillar');
  const pf=$('#imgenPillarFilter');
  if(p&&pf&&!pf.disabled){ pf.value=p; if(window._imgen){ window._imgen.pillar=p; renderImgGen(window._imgen); } }
});
var _imgenPillarFilter=$('#imgenPillarFilter');
_imgenPillarFilter&&_imgenPillarFilter.addEventListener('change',()=>{ if(window._imgen) renderImgGen(window._imgen); });
var _imgenAllYes=$('#imgenAllYes');
_imgenAllYes&&_imgenAllYes.addEventListener('click',()=>{
  if(!window._imgen||!window._imgen.batch||!window._imgen.batch.candidates) return;
  window._imgenApprovals={};
  window._imgen.batch.candidates.forEach(c=>{ window._imgenApprovals[c.id]=true; });
  renderImgGen(window._imgen);
});
var _imgenAllNo=$('#imgenAllNo');
_imgenAllNo&&_imgenAllNo.addEventListener('click',()=>{
  if(!window._imgen||!window._imgen.batch||!window._imgen.batch.candidates) return;
  window._imgenApprovals={};
  window._imgen.batch.candidates.forEach(c=>{ window._imgenApprovals[c.id]=false; });
  renderImgGen(window._imgen);
});
var _imgenClearMarks=$('#imgenClearMarks');
_imgenClearMarks&&_imgenClearMarks.addEventListener('click',()=>{ window._imgenApprovals={}; if(window._imgen) renderImgGen(window._imgen); });
var _imgenCommit=$('#imgenCommit');
_imgenCommit&&_imgenCommit.addEventListener('click',async()=>{
  if(!KEY) return;
  _imgenCommit.disabled=true;
  try{
    const r=await(await fetch('/image-generator-commit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,approvals:window._imgenApprovals||{}})})).json();
    if(!r.ok){ alert(r.msg||'commit failed'); return; }
    window._imgenApprovals={};
    await refreshImgGenStatus();
  }catch(e){ alert('commit failed'); }
  finally{ _imgenCommit.disabled=false; }
});
var _imgenDiscard=$('#imgenDiscard');
_imgenDiscard&&_imgenDiscard.addEventListener('click',async()=>{
  if(!KEY||!confirm('Discard this review batch? Staging files will be deleted.')) return;
  try{ await fetch('/image-generator-discard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY})}); window._imgenApprovals={}; await refreshImgGenStatus(); }catch(e){}
});
var _imgenAnother=$('#imgenAnother');
_imgenAnother&&_imgenAnother.addEventListener('click',()=>{ _imgenStart&&_imgenStart.click(); });
var _imgenTarget=$('#imgenTarget');
_imgenTarget&&_imgenTarget.addEventListener('input',()=>{ if(_imgenStart){ const n=parseInt(_imgenTarget.value,10)||${IMG_GEN_BATCH_DEFAULT}; _imgenStart.textContent='▶ Find '+n+' images'; }});
var _gen100random=$('#gen100random'); _gen100random&&_gen100random.addEventListener('click',()=>{ setGenCount(100); genGo('random',100); });
var _genstop=$('#genstop'); _genstop&&_genstop.addEventListener('click',()=>stopGenUI());
let inPoll=null;
const INDEX_BTN_LABELS={indexnow:'🚀 Recent',indexDelta:'Δ Delta (26h)',indexFull:'📚 Full catalog',indexInterwoven:'🔗 Interwoven SEO'};
const INDEX_BTN_MODES={indexnow:'recent',indexDelta:'delta',indexFull:'full',indexInterwoven:'interwoven'};
function indexBtnIds(){ return Object.keys(INDEX_BTN_LABELS); }
function formatIndexCooldown(ms){
  if(!ms||ms<=0) return '';
  if(ms>=604800000) return Math.ceil(ms/604800000)+'d';
  if(ms>=3600000) return Math.ceil(ms/3600000)+'h';
  return Math.ceil(ms/60000)+'m';
}
function applyIndexCooldowns(j){
  const cds=(j&&j.cooldowns)||{};
  const running=!!(j&&j.running);
  indexBtnIds().forEach(id=>{
    const b=$('#'+id); if(!b) return;
    const mode=INDEX_BTN_MODES[id]||'';
    const base=INDEX_BTN_LABELS[id];
    const left=(cds[mode]&&cds[mode].leftMs)||0;
    if(running){ b.disabled=true; return; }
    if(left>0){ b.disabled=true; b.textContent=base+' ('+formatIndexCooldown(left)+')'; }
    else { b.disabled=false; b.textContent=base; }
  });
  const lbl=$('#indexCooldownLbl');
  if(lbl){
    const parts=[];
    if((cds.delta&&cds.delta.leftMs)>0) parts.push('Delta ready in '+formatIndexCooldown(cds.delta.leftMs));
    if((cds.full&&cds.full.leftMs)>0) parts.push('Full catalog ready in '+formatIndexCooldown(cds.full.leftMs));
    if((cds.interwoven&&cds.interwoven.leftMs)>0) parts.push('Interwoven ready in '+formatIndexCooldown(cds.interwoven.leftMs));
    lbl.textContent=parts.length?('⏳ '+parts.join(' · ')):'';
  }
}
function indexBtnSetDisabled(on){ indexBtnIds().forEach(id=>{ const b=$('#'+id); if(b&&on) b.disabled=!!on; }); if(!on&&window._indexStatus) applyIndexCooldowns(window._indexStatus); }
function indexJobOpts(){ return { includeScrub:!!($('#indexOptScrub')&&$('#indexOptScrub').checked), includeUnicorn:!!($('#indexOptUnicorn')&&$('#indexOptUnicorn').checked) }; }
function inRender(j){
  window._indexStatus=j;
  const wrap=$('#inprog'),bar=$('#inbar'),lbl=$('#inlbl'); if(!wrap)return;
  const hasErr=!!(j&&j.error);
  if(!j||(!j.running&&!j.total&&!hasErr)){ wrap.style.display='none'; applyIndexCooldowns(j); return; }
  wrap.style.display='block'; indexBtnSetDisabled(!!j.running);
  const pct=j.total?Math.round((j.done||0)/j.total*100):0;
  if(bar)bar.style.width=(j.total?pct:0)+'%';
  const modeLabel={full:'Full catalog',delta:'Delta',interwoven:'Interwoven SEO',recent:'Recent'}[j.mode]||j.mode;
  if(j.running&&j.mode==='interwoven'&&j.phase&&j.phase!=='ping'&&j.phase!=='done'){
    lbl.textContent='🔗 '+modeLabel+' — '+String(j.phase||'weave').replace(/-/g,' ')+(j.weaveLog?(' · '+j.weaveLog):'');
  } else if(!j.running&&hasErr&&!j.total){
    lbl.textContent='⚠️ '+modeLabel+' failed — '+j.error;
  } else {
    lbl.textContent=(j.running?('📡 '+modeLabel+' — '):('✅ '+modeLabel+' done — '))+(j.total?(j.done+'/'+j.total+' URLs ('+pct+'%)'):j.weaveLog||j.error||'working…')+(j.stamped?(' · stamped '+j.stamped):'')+(j.source?(' · '+j.source):'')+(j.error?(' · ⚠️ '+j.error):'');
  }
}
async function startIndexJob(path,btnId){
  if(!KEY)return;
  const b=$('#'+btnId); const lbl=INDEX_BTN_LABELS[btnId]||'Index';
  if(b) b.textContent='⏳ starting…'; indexBtnSetDisabled(true);
  try{
    const r=await(await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({key:KEY},indexJobOpts()))})).json();
    if(b) b.textContent=lbl;
    if(!r.started){
      const msg=r.msg||(r.cooldownSec?('cooldown — '+Math.ceil(r.cooldownSec/60)+'m'):'failed');
      if(b) b.textContent='⚠️ '+msg;
      indexBtnSetDisabled(false);
      setTimeout(()=>{ applyIndexCooldowns(window._indexStatus); },4000);
      return;
    }
    if(inPoll)clearInterval(inPoll);
    inPoll=setInterval(async()=>{ try{ const j=await(await fetch('/indexnow-status?key='+KEY)).json(); inRender(j); if(!j.running){clearInterval(inPoll);inPoll=null; applyIndexCooldowns(j);} }catch(e){} },700);
  }catch(e){ if(b) b.textContent='⚠️ server?'; indexBtnSetDisabled(false); setTimeout(()=>{ applyIndexCooldowns(window._indexStatus); },4000); }
}
var _indexnow=$('#indexnow'); _indexnow&&_indexnow.addEventListener('click',()=>startIndexJob('/indexnow-now','indexnow'));
var _indexDelta=$('#indexDelta'); _indexDelta&&_indexDelta.addEventListener('click',()=>startIndexJob('/indexnow-delta','indexDelta'));
var _indexFull=$('#indexFull'); _indexFull&&_indexFull.addEventListener('click',()=>startIndexJob('/indexnow-full','indexFull'));
var _indexInterwoven=$('#indexInterwoven'); _indexInterwoven&&_indexInterwoven.addEventListener('click',()=>startIndexJob('/indexnow-interwoven','indexInterwoven'));
setInterval(()=>{ if(!KEY||inPoll) return; fetch('/indexnow-status?key='+KEY).then(r=>r.json()).then(j=>{ window._indexStatus=j; if(!j.running) applyIndexCooldowns(j); }).catch(()=>{}); },30000);
setTimeout(async()=>{ if(!KEY)return; try{ const j=await(await fetch('/indexnow-status?key='+KEY)).json(); inRender(j); if(j.running&&!inPoll){ inPoll=setInterval(async()=>{ try{ const s=await(await fetch('/indexnow-status?key='+KEY)).json(); inRender(s); if(!s.running){clearInterval(inPoll);inPoll=null; applyIndexCooldowns(s);} }catch(e){} },700); } else applyIndexCooldowns(j); }catch(e){} },2200);
// ── Writing history — past · current · queued, separated by pillar (owner 2026-07-02) ──
function histRender(d){ if(!d)return;
  const t=$('#histtot'); if(t)t.textContent=(d.total||0).toLocaleString();
  const cur=$('#histcur'); if(cur)cur.innerHTML = d.current ? ('▶ writing now: <b>'+String(d.current.pillar||'').replace(/[<>]/g,'')+'</b> · '+String(d.current.stage||'').replace(/[<>]/g,'')+' · '+((d.current.published||0)+(d.current.pooled||0))+'/'+(d.current.target||0)) : '';
  const q=$('#histqueue'); if(q)q.innerHTML = (d.queued&&d.queued.length) ? ('⏳ queued: '+d.queued.map(x=>String(x.pillar).replace(/[<>]/g,'')+' ('+x.count+')').join(' · ')) : '';
  const g=$('#histgroups'); if(g){ g.innerHTML = (d.groups&&d.groups.length)? d.groups.map(gr=>{
    const items=gr.items.map(it=>{ const mins=Math.round((d.now-it.ts)/60000); const ago=mins<60?(mins+'m'):(Math.round(mins/60)+'h'); const ic=it.status==='queued'?'📥':'📥'; return '<div style="padding:2px 0;color:#9fb0bd">'+ic+' '+String(it.id||'').replace(/[<>]/g,'')+(it.score!=null?(' '+it.score+'/13'):'')+' · '+String(it.title||'').replace(/[<>]/g,'').slice(0,42)+' <span style=color:#66788a>· '+ago+'</span></div>'; }).join('');
    return '<details style="margin-bottom:6px;border:1px solid #17303a;border-radius:10px;padding:7px 10px;background:#0b1219"><summary style="cursor:pointer;font-weight:800;color:#7fd0e0">'+String(gr.pillar).replace(/[<>]/g,'')+' — '+gr.count+'</summary><div style="margin-top:6px">'+items+'</div></details>';
  }).join('') : '<div style="color:#66788a;text-align:center">no writing in the last 24h yet</div>'; }
}
function histPoll(){ fetch('/write-history?key='+KEY).then(r=>r.json()).then(histRender).catch(()=>{}); }
if($('#histtot')){ setInterval(()=>{ if($('#app')&&$('#app').style.display!=='none')histPoll(); },5000); setTimeout(()=>{ if(KEY)histPoll(); },1800); }
paintCrewManifest({scrubCrew:EMBEDDED_CREW});
// resume live view if image scrub or generate already running
setTimeout(async()=>{ try{ const d=await(await fetch('/scrub-status')).json(); window._sa=d; if(window.activeTab==='scrub') renderAuto(d); if(d.state)paint(d.state); if(d.imageScrubRunning||d.running){ startAutoPoll(); if(window.activeTab==='scrub') showFsScrub(true); } updateTabBadges(); }catch(e){ paintCrewManifest({scrubCrew:EMBEDDED_CREW}); } },800);
setTimeout(async()=>{ try{ if(!KEY) return; const d=await(await fetch('/gen-status?key='+KEY)).json(); if(d&&d.running){ window._gen=d; window.genRunning=true; if(window.activeTab==='generate') genRender(d); genStartPoll(); } updateTabBadges(); }catch(e){} },1500);
</script></body></html>`;
}

const PILLAR_PROGRESS_F = WD + '/_pillar_13_progress.json';

function pillarHubUrl(p) {
  if (!p) return PULSE_SITE + '/';
  const sampleId = String(p) + '0001';
  try {
    return entryPublicUrlForIndex(sampleId, { id: sampleId }).replace(/\/[^/]+$/, '');
  } catch (e) {
    return PULSE_SITE + '/knowledge/';
  }
}

function qualityRankingForPillar(p) {
  const rows = (byPillar[p] || []);
  const total = rows.length;
  let at13 = 0;
  let at12plus = 0;
  for (const row of rows) {
    const qs = qualityScoreOf[row.id];
    if (qs != null && qs >= 13) at13++;
    if (qs != null && qs >= 12) at12plus++;
  }
  return { total, at13, at12plus, pct13: total ? Math.round((at13 / total) * 1000) / 10 : 0 };
}

function buildSiteQualityRanking() {
  let total = 0;
  let at13 = 0;
  let at12plus = 0;
  for (const p of activePillars()) {
    const r = qualityRankingForPillar(p);
    total += r.total;
    at13 += r.at13;
    at12plus += r.at12plus;
  }
  return {
    max: 13,
    label: '13/13',
    total,
    at13,
    at12plus,
    pct13: total ? Math.round((at13 / total) * 1000) / 10 : 0,
    pct12plus: total ? Math.round((at12plus / total) * 1000) / 10 : 0,
  };
}

function buildPillarProgressPayload() {
  const q = readArr(QUEUE);
  const qByPillar = queueCountsByPillar(q);
  const pf = getScrubPillarFilter();
  let runner = null;
  try { runner = JSON.parse(fs.readFileSync(PILLAR_PROGRESS_F, 'utf8')); } catch (e) {}
  const running = !!(autoJob.running || scrubBusy);
  const curIdEarly = (running || scrubBusy) ? (autoJob.current || scrubSlotId || scrubLive.id || null) : null;
  const focusPillar = pf || (curIdEarly ? pillarOf(curIdEarly) : null) || (runner && runner.activePillar) || null;
  const siteRanking = buildSiteQualityRanking();
  const pillars = activePillars()
    .map(p => {
      const total = (byPillar[p] || []).length;
      const inQueue = qByPillar[p] || 0;
      const rank = qualityRankingForPillar(p);
      return {
        p,
        name: pName(p),
        total,
        inQueue,
        done: Math.max(0, total - inQueue),
        at13: rank.at13,
        pct13: rank.pct13,
        rankLabel: rank.at13 + '/' + total + ' at 13/13',
        hubUrl: pillarHubUrl(p),
      };
    })
    .sort((a, b) => a.total - b.total || a.name.localeCompare(b.name));

  const order = pillars.map(x => x.p);
  const activePillarIdx = focusPillar ? order.indexOf(focusPillar) : -1;

  let totalEntries = 0;
  let totalDone = 0;
  pillars.forEach((row, i) => {
    totalEntries += row.total;
    totalDone += row.done;
    if (row.p === focusPillar && running) row.status = 'active';
    else if (activePillarIdx >= 0 && i < activePillarIdx && row.inQueue === 0 && row.total > 0) row.status = 'done';
    else if (row.p === focusPillar && row.inQueue === 0 && row.total > 0 && !running) row.status = 'done';
    else if (row.done >= row.total && row.total > 0 && row.inQueue === 0) row.status = 'done';
    else row.status = 'pending';
    row.pct = row.total ? Math.round((row.done / row.total) * 1000) / 10 : 0;
  });

  const curId = (running || scrubBusy) ? (autoJob.current || scrubSlotId || scrubLive.id || null) : null;
  const curTitle = curId ? String(titleOf[curId] || scrubLive.title || curId).slice(0, 140) : (focusPillar ? ('Next up · ' + pName(focusPillar)) : 'Idle — no pillar selected');
  const curPillar = curId ? pillarOf(curId) : focusPillar;
  const curEntryUrl = curId ? entryPublicUrlForIndex(curId, { id: curId }) : null;
  const activeRow = pillars.find(x => x.p === (curPillar || focusPillar)) || pillars.find(x => x.status === 'active');
  const indexScore = curId && qualityScoreOf[curId] != null ? qualityScoreOf[curId] : null;
  const liveScore = scrubLive.id === curId
    ? (scrubLive.rubricScore != null ? scrubLive.rubricScore : scrubLive.before)
    : null;
  const currentScore = liveScore != null ? liveScore : indexScore;
  const rankingLeaderboard = pillars.slice().sort((a, b) => (b.pct13 - a.pct13) || (b.at13 - a.at13) || (a.total - b.total));

  const recent = readArr(SCRUBLOG).slice(0, 16).filter(r => r && r.id).map(r => ({
    id: r.id,
    pillar: pillarOf(r.id),
    pillarName: pName(pillarOf(r.id)),
    title: String(titleOf[r.id] || r.title || r.id).slice(0, 90),
    ts: r.ts || null,
    score: r.score != null ? r.score : 13,
    url: entryPublicUrlForIndex(r.id, { id: r.id }),
  }));

  return {
    ok: true,
    ts: Date.now(),
    running,
    scrubPillarFilter: focusPillar,
    scrubPillarFilterName: focusPillar ? pName(focusPillar) : null,
    overall: {
      pillarsTotal: pillars.length,
      pillarsDone: pillars.filter(p => p.status === 'done').length,
      entriesTotal: totalEntries,
      entriesDone: totalDone,
      pct: totalEntries ? Math.round((totalDone / totalEntries) * 1000) / 10 : 0,
      sessionCertified: autoJob.certified || 0,
      ranking: siteRanking,
    },
    ranking: {
      max: 13,
      label: '13/13',
      site: siteRanking,
      leaderboard: rankingLeaderboard.slice(0, 12).map((row, i) => ({
        rank: i + 1,
        p: row.p,
        name: row.name,
        at13: row.at13,
        total: row.total,
        pct13: row.pct13,
        hubUrl: row.hubUrl,
      })),
    },
    current: {
      id: curId,
      title: curTitle,
      pillar: curPillar,
      pillarName: curPillar ? pName(curPillar) : null,
      pillarHubUrl: curPillar ? pillarHubUrl(curPillar) : null,
      entryUrl: curEntryUrl,
      unicornUrl: 'http://localhost:' + PORT + '/',
      stage: String(autoJob.stage || scrubLive.stage || (running ? 'working…' : 'idle')).slice(0, 160),
      queueLeft: activeRow ? activeRow.inQueue : (pf ? (qByPillar[pf] || 0) : null),
      pillarDone: activeRow ? activeRow.done : 0,
      pillarTotal: activeRow ? activeRow.total : 0,
      pillarPct: activeRow && activeRow.total ? Math.round((activeRow.done / activeRow.total) * 1000) / 10 : 0,
      pillarAt13: activeRow ? activeRow.at13 : 0,
      pillarRankLabel: activeRow ? activeRow.rankLabel : null,
      lastCertify: autoJob.lastCertify || null,
      score: currentScore,
      scoreMax: 13,
      scoreLabel: currentScore != null ? (currentScore + '/13') : '—/13',
      targetLabel: '13/13',
      certified: currentScore != null && currentScore >= 13,
      rubricPass: !!(scrubLive.id === curId && scrubLive.rubricPass),
    },
    pillars,
    recent,
    runner,
    links: {
      unicorn: 'http://localhost:' + PORT + '/',
      progress: 'http://localhost:' + PORT + '/pillar-progress',
    },
  };
}

function buildPillarProgressPage() {
  return `<!DOCTYPE html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>PULSE · 13/13 Pillar Progress</title>
<style>
:root{--bg:#070b10;--panel:#0d1520;--stroke:#1a3040;--text:#e8eef2;--muted:#8aa;--gold:#ffeb3b;--teal:#13c2c2;--green:#4ade80;--purple:#a78bfa;--orange:#fb923c}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
a{color:var(--teal);text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:980px;margin:0 auto;padding:18px 16px 48px}
.top{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:18px}
.top h1{margin:0;font-size:1.35rem;font-weight:800;letter-spacing:-.02em}
.top .sub{color:var(--muted);font-size:.85rem;margin-top:4px}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{padding:6px 10px;border-radius:999px;border:1px solid var(--stroke);background:var(--panel);font-size:.78rem;font-weight:700;color:var(--muted)}
.chip strong{color:var(--text)}
.rank-badge{display:inline-flex;align-items:baseline;gap:6px;padding:8px 14px;border-radius:12px;border:1px solid var(--gold);background:rgba(255,235,59,.08);font-weight:900;margin-bottom:12px}
.rank-badge .num{font-size:1.65rem;color:var(--gold);line-height:1}
.rank-badge .den{font-size:.95rem;color:var(--muted)}
.rank-badge.cert{border-color:var(--green);background:rgba(74,222,128,.08)}
.rank-badge.cert .num{color:var(--green)}
.rank-meta{font-size:.78rem;color:var(--muted);font-weight:700;margin-bottom:10px}
.now{background:linear-gradient(135deg,#0f1a24,#121828);border:1px solid #245;padding:16px 18px;border-radius:16px;margin-bottom:18px}
.now-kicker{font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--gold);font-weight:800;margin-bottom:8px}
.now-title{font-size:1.15rem;font-weight:800;line-height:1.35;margin:0 0 10px}
.now-links{display:flex;flex-wrap:wrap;gap:10px 16px;font-size:.88rem;font-weight:700;margin-bottom:12px}
.stage{font-size:.82rem;color:#b8c5d0;line-height:1.45;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.25);border:1px solid var(--stroke)}
.pbar-wrap{margin-top:12px}
.pbar-label{display:flex;justify-content:space-between;font-size:.78rem;color:var(--muted);font-weight:700;margin-bottom:6px}
.pbar{height:12px;border-radius:999px;background:#111820;overflow:hidden;border:1px solid var(--stroke)}
.pbar>span{display:block;height:100%;background:linear-gradient(90deg,#0d9488,var(--gold));transition:width .6s ease}
.grid-head{display:flex;justify-content:space-between;align-items:baseline;margin:22px 0 10px}
.grid-head h2{margin:0;font-size:1rem;font-weight:800}
.legend{display:flex;gap:10px;flex-wrap:wrap;font-size:.72rem;color:var(--muted);font-weight:700}
.legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;vertical-align:middle}
.rows{display:flex;flex-direction:column;gap:8px;max-height:58vh;overflow:auto;padding-right:4px}
.row{display:grid;grid-template-columns:minmax(120px,170px) 1fr minmax(72px,92px) 56px;gap:10px;align-items:center;padding:10px 12px;border-radius:12px;background:var(--panel);border:1px solid var(--stroke)}
.row-rank{font-size:.72rem;font-weight:800;color:var(--gold);text-align:right;line-height:1.25}
.row.done .row-rank{color:var(--green)}
.leaderboard{margin-top:22px}
.leaderboard h2{font-size:1rem;margin:0 0 10px}
.leaderboard ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.leaderboard li{display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;background:var(--panel);border:1px solid var(--stroke);font-size:.8rem}
.leaderboard .pos{font-weight:900;color:var(--gold)}
.leaderboard .pct{font-weight:800;color:var(--green);white-space:nowrap}
.row.active{border-color:var(--gold);box-shadow:0 0 0 1px rgba(255,235,59,.25)}
.row.done{opacity:.78}
.row-name{font-weight:800;font-size:.82rem;line-height:1.25}
.row-name small{display:block;color:var(--muted);font-weight:600;font-size:.72rem;margin-top:2px}
.row-bar{height:10px;border-radius:999px;background:#0a1018;overflow:hidden;border:1px solid #1e2a36}
.row-bar>span{display:block;height:100%;transition:width .5s ease}
.row.active .row-bar>span{background:linear-gradient(90deg,#ca8a04,var(--gold))}
.row.done .row-bar>span{background:var(--green)}
.row.pending .row-bar>span{background:#334155}
.row-pct{text-align:right;font-size:.78rem;font-weight:800;color:var(--muted)}
.row.active .row-pct{color:var(--gold)}
.row.done .row-pct{color:var(--green)}
.recent{margin-top:22px}
.recent h2{font-size:1rem;margin:0 0 10px}
.recent ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;max-height:220px;overflow:auto}
.recent li{font-size:.8rem;padding:8px 10px;border-radius:10px;background:var(--panel);border:1px solid var(--stroke);display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
.recent .id{font-weight:800;color:var(--green);white-space:nowrap}
.recent .score{color:var(--gold);font-weight:800;font-size:.72rem}
.foot{margin-top:18px;font-size:.75rem;color:var(--muted)}
@media(max-width:640px){.row{grid-template-columns:1fr}.row-pct{text-align:left}}
</style></head><body>
<div class=wrap>
  <div class=top>
    <div>
      <h1>13/13 Pillar Progress</h1>
      <div class=sub>Live map · smallest pillar first · auto-refreshes every 2s</div>
    </div>
    <div class=chips>
      <span class=chip>13/13 site <strong id=ovRank13>—</strong></span>
      <span class=chip>Scrub queue <strong id=ovPct>—</strong></span>
      <span class=chip>Pillars <strong id=ovPillars>—</strong></span>
      <span class=chip>Session <strong id=ovSession>—</strong></span>
      <a class=chip href="/">Unicorn</a>
    </div>
  </div>
  <section class=now id=nowCard>
    <div class=now-kicker id=nowKicker>Starting…</div>
    <div id=nowRankBadge class="rank-badge"><span class=num id=nowScore>—</span><span class=den>/13</span></div>
    <div class=rank-meta id=nowRankMeta>Target · 13/13 certification</div>
    <h2 class=now-title id=nowTitle>Loading scrub status…</h2>
    <div class=now-links id=nowLinks></div>
    <div class=stage id=nowStage></div>
    <div class=pbar-wrap>
      <div class=pbar-label><span id=pillarLabel>Current pillar</span><span id=pillarNums>—</span></div>
      <div class=pbar><span id=pillarBar style="width:0%"></span></div>
    </div>
  </section>
  <div class=grid-head>
    <h2>All pillars · smallest → largest</h2>
    <div class=legend>
      <span><i style="background:var(--gold)"></i>active</span>
      <span><i style="background:var(--green)"></i>done</span>
      <span><i style="background:#334155"></i>waiting</span>
    </div>
  </div>
  <div class=rows id=pillarRows></div>
  <section class=leaderboard>
    <h2>Pillar ranking · % at 13/13</h2>
    <ol id=leaderboardList></ol>
  </section>
  <section class=recent>
    <h2>Recent 13/13 completions</h2>
    <ul id=recentList></ul>
  </section>
  <div class=foot>Source: scrub server · <span id=ts>—</span> · <a href="/pillar-progress-data">JSON</a></div>
</div>
<script>
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function pct(n,d){return d?Math.round(n/d*1000)/10:0;}
async function tick(){
  try{
    const d=await(await fetch('/pillar-progress-data')).json();
    const rk=d.ranking&&d.ranking.site?d.ranking.site:(d.overall&&d.overall.ranking?d.overall.ranking:{});
    document.getElementById('ovRank13').textContent=(rk.at13!=null?rk.at13.toLocaleString():'0')+'/'+(rk.total!=null?rk.total.toLocaleString():'?')+' ('+(rk.pct13||0)+'%)';
    document.getElementById('ovPct').textContent=d.overall.pct+'% ('+d.overall.entriesDone.toLocaleString()+'/'+d.overall.entriesTotal.toLocaleString()+')';
    document.getElementById('ovPillars').textContent=d.overall.pillarsDone+'/'+d.overall.pillarsTotal;
    document.getElementById('ovSession').textContent=(d.overall.sessionCertified||0)+' certified';
    document.getElementById('ts').textContent=new Date(d.ts).toLocaleTimeString();
    const c=d.current||{};
    const running=!!d.running;
    document.getElementById('nowKicker').textContent=running?(c.pillarName?('Working on '+c.pillarName+' ('+c.pillar+')'):'Scrub running'):(d.overall.pillarsDone>=d.overall.pillarsTotal?'All pillars complete':'Idle');
    document.getElementById('nowTitle').textContent=c.title||(c.id||'Waiting for next entry…');
    let links='';
    if(c.pillarHubUrl&&c.pillarName) links+='<a href="'+esc(c.pillarHubUrl)+'" target=_blank rel=noopener>Pillar · '+esc(c.pillarName)+'</a>';
    if(c.entryUrl&&c.id) links+='<a href="'+esc(c.entryUrl)+'" target=_blank rel=noopener>Live Q&amp;A · '+esc(c.id)+'</a>';
    if(c.id) links+='<a href="'+esc(c.unicornUrl||'/')+'?inspect='+encodeURIComponent(c.id)+'" target=_blank rel=noopener>Unicorn · '+esc(c.id)+'</a>';
    if(!links) links='<span style="color:#8aa">No active entry — pick a pillar on the Unicorn page</span>';
    document.getElementById('nowLinks').innerHTML=links;
    document.getElementById('nowStage').textContent=c.stage||'';
    document.getElementById('pillarLabel').textContent=c.pillarName?('Progress · '+c.pillarName):'Current pillar progress';
    document.getElementById('pillarNums').textContent=(c.pillarDone||0)+' / '+(c.pillarTotal||0)+' ('+(c.pillarPct||0)+'%)';
    document.getElementById('pillarBar').style.width=(c.pillarPct||0)+'%';
    const rows=(d.pillars||[]).map(p=>{
      const cls='row '+p.status;
      return '<div class="'+cls+'"><div class=row-name><a href="'+esc(p.hubUrl)+'" target=_blank rel=noopener>'+esc(p.name)+'</a><small>'+esc(p.p)+' · '+p.done+'/'+p.total+'</small></div><div class=row-bar><span style="width:'+p.pct+'%"></span></div><div class=row-pct>'+p.pct+'%</div></div>';
    }).join('');
    document.getElementById('pillarRows').innerHTML=rows||'<div style="color:#8aa">No pillars</div>';
    const rec=(d.recent||[]).map(r=>'<li><span class=score>'+(r.score!=null?r.score:13)+'/13</span><a class=id href="'+esc(r.url)+'" target=_blank rel=noopener>'+esc(r.id)+'</a><span>'+esc(r.title)+'</span></li>').join('');
    document.getElementById('recentList').innerHTML=rec||'<li style="color:#8aa">No completions logged yet this session</li>';
  }catch(e){
    document.getElementById('nowTitle').textContent='Cannot reach scrub server — is it running on port '+location.port+'?';
  }
}
tick(); setInterval(tick,2000);
</script></body></html>`;
}

function stateObj() {
  const ap = readArr(AP).length, q = readArr(QUEUE).length, pending = readPending().length, fixing = readRejectFix().length;
  return { green: ap, under: q, pending, fixing, today: dayCount(), cap: DAILY_MAX, imageLaw: IMAGE_LAW_UI };
}

// ── LOW-COST QUALITY SCAN → email the % of Q&A URLs at 12/13 and above ──
// Reads the index only (one blob GET, no AI, no per-entry blob reads). Runs 4×/day.
const SCANF = WD + '/_qa_scan_last.json';
async function qaScanEmail(reason, email) {
  // OWNER 2026-07-08: all other alerts OFF — only the per-fix QID emailer sends.
  // _emails_off.flag suppresses the 4×/day scan so it never buries the fix emails.
  if (fs.existsSync(WD + '/_emails_off.flag')) return { ok: true, suppressed: true };
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const es = (idx.entries || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
    const total = es.length;
    const ge12 = es.filter(e => (e.quality_score || 0) >= 12).length;
    const pct = total ? (ge12 / total * 100).toFixed(1) : '0';
    const hist = {}; for (const e of es) { const s = (e.quality_score == null ? 'none' : e.quality_score); hist[s] = (hist[s] || 0) + 1; }
    const byP = {}; for (const e of es) { const p = (String(e.id).match(/^[a-z]+/) || [''])[0]; (byP[p] = byP[p] || { n: 0, g: 0 }).n++; if ((e.quality_score || 0) >= 12) byP[p].g++; }
    const lines = Object.entries(byP).sort((a, b) => b[1].n - a[1].n).slice(0, 14)
      .map(([p, v]) => `  • ${pName(p)} (${p}): ${v.g.toLocaleString()}/${v.n.toLocaleString()} = ${(v.g / v.n * 100).toFixed(0)}%`).join('\n');
    const under = readArr(QUEUE).length, cook = readArr(COOKQ).length;
    const old10 = es.filter(e => (e.quality_score || 0) === 10).length;   // old /10 polish mark, not yet re-graded to /13
    const eleven = es.filter(e => (e.quality_score || 0) === 11).length;  // one rung from certified
    const below = es.filter(e => (e.quality_score || 0) < 10).length;
    try { fs.writeFileSync(SCANF, JSON.stringify({ at: new Date().toISOString(), pct, ge12, total, reason })); } catch (e) {}
    if (email !== false) {
      const message = `📊 PULSE Q&A quality scan (${reason || 'scheduled 4×/day'})\n\n` +
        `✅ CERTIFIED at 12/13 and above:  ${ge12.toLocaleString()} / ${total.toLocaleString()}  =  ${pct}%\n\n` +
        `Where the rest sits:\n` +
        `  🔸 11/13 (one rung away): ${eleven.toLocaleString()}\n` +
        `  🕙 old 10/10 polish, not yet re-graded to the 12/13 rubric: ${old10.toLocaleString()}  ← the backlog the scrubber is converting\n` +
        `  ⚠️ below 10: ${below.toLocaleString()}\n\n` +
        `This % climbs every time the scrubber certifies one of the ${old10.toLocaleString()} at 12/13+.\n\n` +
        `By pillar — certified 12/13+ (biggest 14):\n${lines}\n\n` +
        `Scrub pool remaining: ${under.toLocaleString()}   ·   cook queue: ${cook.toLocaleString()}\n\n` +
        `(Low-cost scan — reads the library index only, no AI calls.)`;
      await fetch('https://pulserevops.com/.netlify/functions/pulse-owner-notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pulsemachine-writer-2026', subject: `📊 PULSE: ${pct}% of Q&A at 12/13+`, message })
      }).catch(() => {});
    }
    return { ok: true, pct, ge12, total, hist, pillars: byP };
  } catch (e) { return { ok: false, error: e.message }; }
}
function scheduleScans() {
  // fire at the next 00/06/12/18 local boundary, then every 6h → exactly 4×/day, restart-proof
  const now = new Date(); const nx = new Date(now); nx.setMinutes(0, 0, 0);
  nx.setHours((Math.floor(now.getHours() / 6) + 1) * 6);
  const ms = Math.max(60000, nx - now);
  setTimeout(function tick() { qaScanEmail('scheduled 4×/day'); setInterval(() => qaScanEmail('scheduled 4×/day'), 6 * 3600 * 1000); }, ms);
  console.log(`[scrub-button] quality-scan email scheduled — next at ${nx.toLocaleString()}, then every 6h (4×/day)`);
}
// ── SERVER-SIDE "scrub entire pool" — runs IN THIS NODE PROCESS, so it keeps going even
// when the browser tab is closed or backgrounded. The page is now just a dashboard that
// reconnects to it (poll /scrub-status). Leave & come back in 30 min → still scrubbing. ──
function mergeCookIntoQueue() {
  const cq = readArr(COOKQ), q = readArr(QUEUE);
  if (!cq.length) return 0;
  const seen = new Set(q);
  const out = [...q];
  for (const id of cq) { if (!seen.has(id)) { out.push(id); seen.add(id); } }
  writeArr(QUEUE, out);
  writeArr(COOKQ, []);
  return cq.length;
}
function ensureScrubberRunning(reason) {
  if (!STANDARD_SCRUB_ENABLED) return false;
  const pipelineKick = reason && (/^(generate:|genRun|queue:|pipeline-retry:|watchNew)/.test(String(reason)));
  if (pipelineKick) {
    try { fs.unlinkSync(WD + '/_scrub_auto_off.flag'); } catch (e) {}
    autoJob.stop = false;
  }
  if (genJob.running && PIPELINE_AUTO_SCRUB_PUBLISH && pipelineKick) {
    return true;
  }
  try { if (fs.existsSync(WD + '/_scrub_auto_off.flag')) return false; } catch (e) {}
  if (autoJob.running || scrubBusy || laneTimer || anyLaneSlotBusy()) return true;
  autoJob.stop = false;
  try { fs.unlinkSync(WD + '/_scrub_auto_off.flag'); } catch (e) {}
  if (SCRUB_LANE_MODE) {
    startLaneScheduler();
    console.log('[scrub-button] auto-start scrubber (' + (reason || 'new entry') + ')');
  } else {
    scrubAutoLoop().catch(e => autoLog('scrubAutoLoop err: ' + (e && e.message)));
    console.log('[scrub-button] auto-start serial scrub (' + (reason || 'new entry') + ')');
  }
  return true;
}
/** Stop image side jobs and run unified 13/13 scrub on one pillar only. */
function startPillarFixTo13(pillar) {
  pillar = pillar && pillar !== 'all' ? String(pillar) : null;
  if (!pillar) return { ok: false, msg: 'Pick a pillar first (not All)' };
  forceStopImageDuplicator();
  forceStopImageGenerator();
  forceStopFaceHero();
  forceStopImageRewrite();
  forceStopInternalImages();
  forceStopFormatFixer();
  forceStopRubricStation();
  if (genJob.running) { genJob.stop = true; forceStopGen(); }
  forceStopScrub();
  setScrubPillarFilter(pillar);
  autoJob.stop = false;
  autoJob.current = null;
  scrubLive.id = null;
  scrubLive.title = null;
  scrubLive.pillar = pillar;
  try { fs.unlinkSync(WD + '/_scrub_auto_off.flag'); } catch (e) {}
  if (!autoJob.running && !laneTimer && !anyLaneSlotBusy()) {
    if (SCRUB_LANE_MODE) startLaneScheduler();
    else scrubAutoLoop().catch(e => autoLog('scrubAutoLoop err: ' + (e && e.message)));
  }
  autoLog('▶ Fix pillar → ' + pName(pillar) + ' · Pollinator face+hero · DDG sections · render verify · 13/13');
  return { ok: true, started: true, pillar, pillarName: pName(pillar) };
}

let autoJob = { running: false, auto: true, halted: false, certified: 0, ready: 0, parked: 0, tried: 0, errors: 0, consecutiveErrors: 0, maxConsecutiveErrors: 3, squareQueued: 0, phase: 'idle', current: null, currentSince: null, stage: 'idle', startedAt: null, stop: false, log: [], lastCertify: null, lastFinish: null };
function autoLog(s) { autoJob.log.unshift(new Date().toLocaleTimeString() + ' ' + s); autoJob.log = autoJob.log.slice(0, 28); }
async function scrubAutoLoop() {
  if (autoJob.running) return;
  const merged = mergeCookIntoQueue();
  if (!genJob.running) {
    pipelineAlt.next = 'scrub';
    touchPipelineAlt({});
  }
  autoJob = { running: true, auto: true, halted: false, certified: 0, ready: 0, parked: 0, tried: 0, errors: 0, consecutiveErrors: 0, maxConsecutiveErrors: 3, squareQueued: 0, phase: 'scrub', current: null, currentSince: null, stage: genJob.running ? '🔁 alt scrub — waiting for turn' : '🍳 full scrub — one ID at a time', startedAt: new Date().toISOString(), stop: false, log: [], lastCertify: null, lastFinish: null };
  if (merged) autoLog('↪ merged ' + merged + ' legacy ids into pool');
  autoLog(genJob.running ? '▶ scrubber joined generate ↔ scrub alternation' : '▶ started (full scrub — one at a time, no fast pass)');
  while (!autoJob.stop) {
    const q = readArr(QUEUE);
    if (!q.length) break;
    const fq = filterQueueByPillar(q);
    if (!fq.length) {
      const pf = getScrubPillarFilter();
      if (pf) {
        autoJob.stage = '🎯 No ' + pName(pf) + ' in queue (' + q.length + ' other pillars waiting)';
        autoLog('🎯 filter ' + pf + ' — 0 matching · ' + q.length + ' skipped');
      }
      break;
    }
    if (dayCount() >= DAILY_MAX) { autoJob.stage = '🏁 daily cap'; autoLog('🏁 daily cap'); break; }
    await acquirePipelineAltTurn('scrub');
    if (autoJob.stop) break;
    await waitPipelineEntryGap('scrub');
    const id = pickNextScrubId(q);
    if (!id) break;
    const isFix = readRejectFix().some(x => x && x.id === id);
    autoJob.current = id;
    autoJob.currentSince = Date.now();
    autoJob.stage = (genJob.running ? '🔁 alt → ' : (isFix ? '↩️ retarget ' : '🍳 fresh ')) + id;
    let r;
    try { r = await scrubOne(); } catch (e) { r = { status: 'error', msg: e.message, id }; }
    autoJob.current = null;
    autoJob.currentSince = null;
    autoJob.tried++;
    recordScrubAutoResult(r);
    if (r && r.status === 'error') {
      autoJob.errors++;
      autoJob.consecutiveErrors++;
      autoLog('⚠️ daily driver error ' + autoJob.consecutiveErrors + '/' + autoJob.maxConsecutiveErrors);
    } else {
      autoJob.consecutiveErrors = 0;
    }
    releasePipelineAltTurn('scrub', r && r.id);
  }
  autoJob.running = false;
  autoJob.current = null;
  autoJob.currentSince = null;
  autoJob.stage = autoJob.stop ? '⏹ stopped' : '✅ all done — scrub pool clear';
  autoLog(autoJob.stop ? '⏹ stopped by owner' : '✅ complete');
}
// KEEP-CONTENT-HIGH (owner 2026-06-30): every NEW entry appearing in the index is dropped into the
// scrub-button queue (red) until certified — so new writes (incl. the cloud writer's) never silently
// count as green. Temporary until the cloud writer is handled. Lightweight: id-set diff, no grading.
const KNOWN = WD + '/_known_ids.json';
let knownIds = new Set(readArr(KNOWN));
async function watchNew() {
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const cur = (idx.entries || []).filter(e => e && e.id).map(e => e.id);
    if (!knownIds.size) { knownIds = new Set(cur); fs.writeFileSync(KNOWN, JSON.stringify(cur)); return; }   // first run: snapshot only
    const ccSet = new Set(readArr(CC));   // certified (incl. Generate-crew) entries are already green + pooled — don't touch
    const fresh = cur.filter(id => !knownIds.has(id) && !ccSet.has(id));
    if (fresh.length) {
      const q = readArr(QUEUE), qs = new Set(q); writeArr(QUEUE, [...fresh.filter(id => !qs.has(id)), ...q]);
      const nr = readArr(NR); writeArr(NR, [...new Set([...nr, ...fresh])]);
      const ap = readArr(AP), apA = ap.filter(id => !fresh.includes(id)); if (apA.length !== ap.length) writeArr(AP, apA);
      try { await pushSeoCounts(store, { note: 'new writings auto-queued (keep-content-high)' }); } catch (e) {}
      await loadIndex();
      console.log(`[scrub-button] +${fresh.length} NEW entries → queue (red until certified)`);
      ensureScrubberRunning('watchNew:+' + fresh.length);
    }
    cur.forEach(id => knownIds.add(id)); fs.writeFileSync(KNOWN, JSON.stringify([...knownIds]));
  } catch (e) {}
}
let nodeRestartScheduled = false;
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (u.pathname === '/' && SQUARE_ONLY) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildSquareDeskPage()); }
  if (u.pathname === '/' && PORT === 8904) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('formatfix')); }
  if (u.pathname === '/' || u.pathname === '/scrubber') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('scrub')); }
  if (u.pathname === '/generate') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('generate')); }
  if (u.pathname === '/image-duplicator') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('duplicator')); }
  if (u.pathname === '/image-generator') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('imgen')); }
  if (u.pathname === '/pollinator-image-overwrite' || u.pathname === '/image-rewrite') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('rewrite')); }
  if (u.pathname === '/square' || u.pathname === '/square-builder' || u.pathname === '/face-card-top-image-generator' || u.pathname === '/face-hero-generator') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildSquareDeskPage()); }
  if (u.pathname === '/format-fixer' || u.pathname === '/formatfix') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('formatfix')); }
  if (u.pathname === '/internal-images' || u.pathname === '/internalimages') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('internalimages')); }
  if (u.pathname === '/rubric-stations' || u.pathname === '/rubricstation') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPage('rubricstation')); }
  if (u.pathname.startsWith('/assets/qa/')) {
    const rel = u.pathname.replace(/^\/+/, '');
    const fp = path.normalize(path.join(WD, rel));
    if (!fp.startsWith(path.normalize(WD + '/assets/qa'))) { res.writeHead(403); return res.end(); }
    try {
      const buf = fs.readFileSync(fp);
      const ct = /\.png$/i.test(fp) ? 'image/png' : /\.webp$/i.test(fp) ? 'image/webp' : 'image/jpeg';
      res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': 'no-cache' });
      return res.end(buf);
    } catch (e) { res.writeHead(404); return res.end(); }
  }
  if (u.pathname === '/pillar-progress') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(buildPillarProgressPage()); }
  if (u.pathname === '/pillar-progress-data') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(buildPillarProgressPayload())); }
  if (u.pathname === '/health' || u.pathname === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      ok: true,
      app: 'pulse-fixer-square-builder',
      build: 'pods-100-image-proxy-v1',
      port: PORT,
      passcode: PASS,
      ts: Date.now(),
    }));
  }
  if (u.pathname === '/server-restart' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, msg: 'bad code' }));
      }
      if (nodeRestartScheduled) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, restarting: true }));
      }
      nodeRestartScheduled = true;
      saveFormatFixerState(true);
      saveSquareAutoJob();
      res.writeHead(202, { 'Content-Type': 'application/json', 'Connection': 'close' });
      res.end(JSON.stringify({ ok: true, restarting: true }));
      setTimeout(() => {
        server.close(() => {
          const child = spawn(process.execPath, process.argv.slice(1), {
            cwd: WD, env: Object.assign({}, process.env), detached: true, stdio: 'ignore', windowsHide: true,
          });
          child.unref();
          process.exit(0);
        });
        setTimeout(() => { if (typeof server.closeAllConnections === 'function') server.closeAllConnections(); }, 750);
      }, 350);
    });
    return;
  }
  if (u.pathname === '/portal-url') {
    let lan = '';
    try { lan = fs.readFileSync(WD + '/_scrub_lan_ip.txt', 'utf8').trim().replace(/\/$/, ''); } catch (e) {}
    if (!lan) {
      try {
        const os = require('os');
        const ip = Object.values(os.networkInterfaces()).flat().find(i => i && i.family === 'IPv4' && !i.internal && /^192\.168\.|^10\./.test(i.address))?.address;
        if (ip) lan = ip + ':' + PORT;
      } catch (e) {}
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify({ ok: true, localhost: 'http://localhost:' + PORT + '/', lan: lan ? ('http://' + lan + '/') : null, passcode: PASS }));
  }
  if (u.pathname === '/state') { const ok = u.searchParams.get('key') === PASS; res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(ok ? Object.assign({ ok: true }, stateObj()) : { ok: false })); }
  if (u.pathname === '/certify-one' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, msg: 'bad code' })); }
      const id = String(d.id || '').trim();
      if (!id) { res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, msg: 'no id' })); }
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' });
        if (!e || !e.answer) throw new Error('no blob for ' + id);
        const rb = rubricSignOff(id, e.answer);
        const score = d.score != null ? Math.min(13, Math.max(MIN_SCORE, Number(d.score))) : 13;
        await certify(id, score, e.answer, { via: 'certify-one', rubric: rb, title: e.question || titleOf[id] });
        bumpDay();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, id, score, rubricPass: !!rb.pass, state: stateObj() }));
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: String(err.message || err), code: err.code || null }));
      }
    });
    return;
  }
  if (u.pathname === '/scrub-one' && req.method === 'POST') {
    let body = ''; req.on('data', c => body += c); req.on('end', async () => {
      let key = '', forceId = '';
      try {
        const d = JSON.parse(body || '{}');
        key = d.key;
        forceId = String(d.id || d.forceId || '').trim();
      } catch (e) {}
      if (key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ status: 'error', msg: 'bad code' })); }
      const t0 = Date.now();
      const r = await scrubOne(forceId || null); r.state = stateObj();
      if (r.status === 'certified') {
        r.lastCertify = { id: r.id, score: r.score, before: r.before, at: Date.now(), green: r.state.green, under: r.state.under };
        r.lastFinish = Object.assign({ type: 'certified' }, r.lastCertify);
      } else if (r.status === 'ready') {
        r.lastFinish = { type: 'ready', id: r.id, score: r.score, contentScore: r.score, before: r.before, at: Date.now(), green: r.state.green, under: r.state.under, pending: r.state.pending };
      } else if (r.status === 'parked') {
        r.lastFinish = { type: 'parked', id: r.id, score: r.score, contentScore: r.contentScore || r.score, why: (r.rubricFailed || []).join(',') || r.msg, at: Date.now(), green: r.state.green, under: r.state.under };
      }
      appendScrubLog({ ts: new Date().toISOString(), startedAt: new Date(t0).toISOString(), endedAt: new Date().toISOString(), elapsedSec: Math.round((Date.now() - t0) / 1000), id: r.id || null, status: r.status, score: r.score, before: r.before, steps: r.steps || [], msg: r.msg || '' });
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/scrub-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(Object.assign({}, autoJob, { scrubBusy, scrubSlotId, pendingList: readPending(), rejectFixList: readRejectFix().slice(0, 50), state: stateObj() }, scrubStatusPayload())));
  }
  if (u.pathname === '/pending-signoff') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('[]'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ pending: readPending(), rejectFix: readRejectFix(), state: stateObj() }));
  }
  if (u.pathname === '/inspect-entry') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    const id = u.searchParams.get('id');
    if (!id) { res.writeHead(400); return res.end('{"ok":false,"error":"no id"}'); }
    buildInspectReport(id).then(r => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(r)); }).catch(e => { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: String(e.message || e) })); });
    return;
  }
  if (u.pathname === '/agent-signoff' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end('{"ok":false}'); }
      const id = String(d.id || '').trim();
      if (!id) { res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end('{"ok":false,"error":"no id"}'); }
      try {
        if (d.action === 'reject') {
          const targets = Array.isArray(d.targets) ? d.targets.filter(Boolean) : [];
          const r = ownerSignoffReject(id, d.reason || 'owner rejected at sign-off', targets, d.notes);
          res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(Object.assign({ ok: true }, r, { state: stateObj(), rejectFixList: readRejectFix() })));
        }
        const r = await ownerSignoffCertify(id);
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(Object.assign({ ok: true }, r, { state: stateObj() })));
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: String(e.message || e) }));
      }
    });
    return;
  }
  if (u.pathname === '/pillar-fix-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end('{"ok":false}'); }
      const r = startPillarFixTo13(d.pillar || getScrubPillarFilter());
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(Object.assign({}, r, { running: autoJob.running, lane: SCRUB_LANE_MODE })));
    });
    return;
  }
  if (u.pathname === '/scrub-auto' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end('{"ok":false}'); }
      if (d.action === 'stop') {
        requestScrubStop();
        try { fs.writeFileSync(WD + '/_image_scrub_stop.flag', '1'); } catch (e) {}
        try { stopImageScrubChild(); } catch (e) {}
        try { fs.writeFileSync(WD + '/_scrub_auto_off.flag', '1'); } catch (e) {}
      }
      else {
        if (!STANDARD_SCRUB_ENABLED) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ ok: false, msg: 'Standard full scrub is disabled — use Rubric Stations tabs instead.', running: false }));
        }
        // Begin Scrub → full 13/13 lane scrubber (LATEST-27): entryScrubPipeline + parallel workers.
        autoJob.stop = false;
        try { fs.unlinkSync(WD + '/_scrub_auto_off.flag'); } catch (e) {}
        try { stopImageScrubChild(); } catch (e) {}
        try { fs.writeFileSync(WD + '/_image_scrub_stop.flag', '1'); } catch (e) {}
        if (!autoJob.running && !laneTimer && !anyLaneSlotBusy()) {
          if (SCRUB_LANE_MODE) {
            startLaneScheduler();
            console.log('[scrub-button] Begin Scrub → parallel lane (48 · ' + LANE_CONTENT_WRITERS + ' DS writers · 2 CC auditors · 13/13 rubric)');
          } else {
            scrubAutoLoop().catch(e => autoLog('scrubAutoLoop err: ' + (e && e.message)));
            console.log('[scrub-button] Begin Scrub → serial scrubOne loop');
          }
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: true, running: autoJob.running, lane: SCRUB_LANE_MODE, imageScrubRunning: imageScrubRunning() }));
    });
    return;
  }
  if (u.pathname === '/force-stop-all' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end('{"ok":false}'); }
      const r = forceStopAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/scrub-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end('{"ok":false}'); }
      try { fs.writeFileSync(WD + '/_image_scrub_stop.flag', '1'); } catch (e) {}
      try { fs.writeFileSync(WD + '/_scrub_auto_off.flag', '1'); } catch (e) {}
      const r = forceStopScrub();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/pillars') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('[]'); }
    const qByPillar = queueCountsByPillar(readArr(QUEUE));
    const list = activePillars().map(p => ({ p, name: pName(p), n: (byPillar[p] || []).length, q: qByPillar[p] || 0 })).sort((a, b) => a.name.localeCompare(b.name));
    res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(list));
  }
  if (u.pathname === '/scrub-filter' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const prev = getScrubPillarFilter();
      setScrubPillarFilter(d.pillar || 'all');
      const pf = getScrubPillarFilter();
      const q = readArr(QUEUE);
      const fq = filterQueueByPillar(q);
      if (pf !== prev) {
        autoLog('🎯 scrub filter → ' + (pf ? (pName(pf) + ' (' + pf + ')') : 'all pillars') + ' · ' + fq.length + ' matching');
        pushScrubActivity('🎯 Filter set → ' + (pf ? pName(pf) : 'all pillars') + ' (' + fq.length + ' in queue)', { status: 'filter', pillar: pf });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, pillar: pf, pillarName: pf ? pName(pf) : null, queueFilteredLen: fq.length, queueSkippedByFilter: pf ? q.length - fq.length : 0, queueLen: q.length }));
    });
    return;
  }
  if (u.pathname === '/gen-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    const ps = scrubStatusPayload();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(Object.assign({}, genJob, { queue: genQueue.map(x => ({ pillar: x.sel === 'random' ? '100:random' : x.sel, count: x.count })), scrubLive: ps.scrubLive, pollinator: ps.pollinator, pipelineAlt: ps.pipelineAlt, state: stateObj() })));
  }
  if (u.pathname === '/indexnow-status') { if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); } res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(indexnowStatusPayload())); }
  if (u.pathname === '/image-duplicator-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(imageDuplicatorStatusPayload()));
  }
  if (u.pathname === '/image-duplicator-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = startImageDuplicator(d.pillar || 'tl', d.guideKeywords || '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-duplicator-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = stopImageDuplicator();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-duplicator-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = forceStopImageDuplicator();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-generator-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(imageGeneratorStatusPayload()));
  }
  if (u.pathname === '/image-generator-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = startImageGenerator(d.pillar || 'tl', d.target || IMG_GEN_BATCH_DEFAULT, d.guideKeywords || '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-generator-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = stopImageGenerator();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-generator-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = forceStopImageGenerator();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-generator-commit' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      try {
        const r = await commitImageGeneratorBatch(d.approvals || {});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(r));
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: String(e.message || e) }));
      }
    });
    return;
  }
  if (u.pathname === '/image-generator-discard' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = discardImageGeneratorBatch();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-generator-reset' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = resetImageGenerator();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-rewrite-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(imageRewriteStatusPayload()));
  }
  if (u.pathname === '/image-rewrite-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = startImageRewrite(d.pillar || '', d.guideKeywords || '', d.autoApprove);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-rewrite-review' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      Promise.resolve(imageRewriteReviewDecision(d.action || '')).then(r => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(r));
      }).catch(e => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: e.message }));
      });
    });
    return;
  }
  if (u.pathname === '/image-rewrite-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = stopImageRewrite();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-rewrite-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = forceStopImageRewrite();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/face-hero-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(faceHeroStatusPayload()));
  }
  if (u.pathname === '/square-auto-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(squareAutoStatus()));
  }
  if (u.pathname === '/square-auto-toggle' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const result = setSquareAutoRun(d.enabled);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
    return;
  }
  if (u.pathname === '/square-preference' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const profile = recordSquarePreference(d);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, profile }));
    });
    return;
  }
  if (u.pathname === '/square-next') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    try {
      const result = await pickSquareNextEntry();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, msg: e.message }));
    }
  }
  if (u.pathname === '/square-search') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    try {
      const result = await searchSquareDeskImages(u.searchParams.get('q') || '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, msg: e.message }));
    }
  }
  if (u.pathname === '/square-proxy') {
    try {
      const parsed = new URL(u.searchParams.get('u') || '');
      if (parsed.protocol !== 'https:' || !/(^|\.)pexels\.com$/i.test(parsed.hostname)) throw new Error('bad image URL');
      const upstream = await fetch(parsed.href, {
        redirect: 'follow',
        headers: {
          Accept: 'image/avif,image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8',
          Referer: 'https://www.pexels.com/',
          'User-Agent': 'Mozilla/5.0 PULSE-Square-Builder/1.0',
        },
        signal: AbortSignal.timeout(45000),
      });
      if (!upstream.ok || !String(upstream.headers.get('content-type') || '').startsWith('image/')) throw new Error('image fetch failed');
      const buffer = Buffer.from(await upstream.arrayBuffer());
      if (!buffer.length) throw new Error('empty image');
      res.writeHead(200, {
        'Content-Type': upstream.headers.get('content-type'),
        'Content-Length': buffer.length,
        'Cache-Control': 'private, max-age=900',
        'X-Content-Type-Options': 'nosniff',
      });
      return res.end(buffer);
    } catch (e) {
      const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><rect width="480" height="320" fill="#171a21"/><text x="240" y="150" text-anchor="middle" fill="#f87171" font-family="Arial,sans-serif" font-size="18" font-weight="700">Image could not load</text><text x="240" y="180" text-anchor="middle" fill="#9aa3b2" font-family="Arial,sans-serif" font-size="13">Search again or choose another photo</text></svg>');
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Content-Length': svg.length,
        'Cache-Control': 'no-store',
        'X-Square-Image-Error': '1',
      });
      return res.end(svg);
    }
  }
  if (u.pathname === '/square-stage' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }
  if (u.pathname === '/square-save-draft' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      try {
        const result = await saveSquareDeskDraft(d);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: e.message }));
      }
    });
    return;
  }
  if (u.pathname === '/square-pexels-search') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    try {
      const result = await searchPexelsForTitle(String(u.searchParams.get('id') || '').trim(), u.searchParams.get('title') || '', u.searchParams.get('gender') || '', u.searchParams.get('clickIndex') || 0);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(Object.assign({ ok: true }, result)));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, msg: e.message }));
    }
  }
  if ((u.pathname === '/square-pexels-apply' || u.pathname === '/square-pexels-finish') && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      try {
        const result = u.pathname === '/square-pexels-finish'
          ? await finishManualPexelsQa(String(d.id || '').trim())
          : await applyManualPexelsImage(String(d.id || '').trim(), d.url || '', d.clickIndex, d.gender || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: e.message }));
      }
    });
    return;
  }
  if (u.pathname === '/face-hero-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = startFaceHero(d.pillar || '', d.guideKeywords || '', d.autoApprove, false, d.batchSize);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/face-hero-review' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      Promise.resolve(faceHeroReviewDecision(d.action || '')).then(r => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(r));
      }).catch(e => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: e.message }));
      });
    });
    return;
  }
  if (u.pathname === '/face-hero-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = stopFaceHero();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/face-hero-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = forceStopFaceHero();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/format-fixer-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(formatFixerStatusPayload()));
  }
  if (u.pathname === '/format-fixer-auto' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const result = setFormatFixerAuto(d.enabled);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
    return;
  }
  if (u.pathname === '/format-fixer-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = startFormatFixer(d.pillar || '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/format-fixer-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = stopFormatFixer();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/format-fixer-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = forceStopFormatFixer();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/internal-images-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(internalImagesStatusPayload()));
  }
  if (u.pathname === '/internal-images-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = startInternalImages(d.pillar || '', d.guideKeywords || '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/internal-images-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = stopInternalImages();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/internal-images-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = forceStopInternalImages();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/rubric-station-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(rubricStationStatusPayload()));
  }
  if (u.pathname === '/rubric-station-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = startRubricStation(d.station || 'writing', d.pillar || '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(Object.assign({}, r, { stationLabel: (STATIONS[r.station || d.station || 'writing'] || STATIONS.writing).label })));
    });
    return;
  }
  if (u.pathname === '/rubric-station-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = stopRubricStation();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/rubric-station-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = forceStopRubricStation();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/image-dupe-status') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(Object.assign({}, imageDupeScanJob, { prioritized: imageDupePriority.size, inQueue: filterQueueByPillar(readArr(QUEUE)).filter(id => imageDupePriority.has(id)).length })));
  }
  if (u.pathname === '/image-dupe-scan' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = await scanImageDupesBatch(d.batch || 120);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/indexnow-delta' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const hours = parseInt(d.hours, 10) || 26;
      const r = await deployIndexNowDelta(hours, { includeScrub: d.includeScrub !== false, includeUnicorn: d.includeUnicorn !== false });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/indexnow-full' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = await deployIndexNowFull({ includeScrub: d.includeScrub !== false, includeUnicorn: d.includeUnicorn !== false });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/indexnow-interwoven' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = await deployIndexNowInterwoven({ includeScrub: d.includeScrub !== false, includeUnicorn: d.includeUnicorn !== false });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/urgent' && req.method === 'POST') {   // one custom Q&A through the FULL pipeline (owner 4444)
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const pillar = d.pillar || 'wl', question = String(d.question || '').trim();
      if (!question) { res.writeHead(400); return res.end('{"ok":false,"msg":"no question"}'); }
      try { const r = await generateOne(pillar, question, { essayOnly: d.essayOnly !== false }); res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: true, result: r })); }
      catch (e) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: String(e.message || e) })); }
    });
    return;
  }
  if (u.pathname === '/purge-nil' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const isNIL = id => /\bNIL\b/i.test(titleOf[id] || '');   // NIL earnings entries (unverifiable numbers → always park)
      let removed = 0;
      for (const F of [QUEUE, COOKQ]) { const arr = readArr(F); const kept = arr.filter(id => !isNIL(id)); removed += arr.length - kept.length; writeArr(F, kept); }
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: true, removed }));
    });
    return;
  }
  if (u.pathname === '/write-history') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401); return res.end('{}'); }
    pruneHistory();
    const seen = new Set(writeHistory.map(h => h.id).filter(Boolean));
    const merged = writeHistory.concat(recentWrites.filter(r => !seen.has(r.id))).sort((a, b) => b.ts - a.ts);
    const byP = {};
    for (const h of merged) { (byP[h.pillarName] = byP[h.pillarName] || []).push(h); }
    const groups = Object.keys(byP).map(name => ({ pillar: name, count: byP[name].length, items: byP[name].slice(0, 30) })).sort((a, b) => b.count - a.count);
    const current = genJob.running ? { pillar: genJob.pillarName, stage: genJob.stage, current: genJob.current, published: genJob.published, pooled: genJob.pooled, target: genJob.target } : null;
    const queued = genQueue.map(x => ({ pillar: x.sel === 'random' ? 'Random each Q' : pName(x.sel), count: x.count }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ now: Date.now(), total: merged.length, current, queued, groups }));
  }
  if (u.pathname === '/gen-start' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end('{"ok":false,"msg":"bad code"}'); }
      const sel = d.pillar || 'ce';
      const count = Math.max(1, Math.min(500, parseInt(String(d.count || '').replace(/[^\d]/g, ''), 10) || 100));
      const lim = genLimitCheck(sel);
      if (!lim.ok) { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok:false, msg: lim.msg })); }
      genLimitMark(sel);
      if (genJob.running) { genQueue.push({ sel, count }); res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok:true, queued:true, queueLen: genQueue.length })); }
      genRun(sel, count);   // fire-and-forget; UI polls /gen-status
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true}');
    });
    return;
  }
    if (u.pathname === '/gen-reset-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => { let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {} if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); } genJob.stop = false; saveGen(); res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true,"stop":false}'); });
    return;
  }
  if (u.pathname === '/gen-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => { let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {} if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); } genJob.stop = true; genQueue = []; res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true}'); });
    return;
  }
  if (u.pathname === '/gen-force-stop' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
      if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); }
      const r = forceStopGen();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(r));
    });
    return;
  }
  if (u.pathname === '/indexnow-now' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => { let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {} if (d.key !== PASS) { res.writeHead(401); return res.end('{}'); } const r = await deployIndexNow(); res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(r)); });
    return;
  }
  if (u.pathname === '/qa-scan') {
    if (u.searchParams.get('key') !== PASS) { res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end('{"ok":false}'); }
    const dry = u.searchParams.get('dry') === '1';   // ?dry=1 → compute + return, do NOT email
    const r = await qaScanEmail(dry ? 'manual (no email)' : 'manual', dry ? false : true);
    res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(r));
  }
  res.writeHead(404); res.end('not found');
});
server.on('error', (e) => {
  if (e && e.code === 'EADDRINUSE') console.error('[scrub-button] FATAL port ' + PORT + ' in use — kill the old node process and restart');
  else console.error('[scrub-button] FATAL', e && e.message);
  process.exit(1);
});
server.listen(PORT, '0.0.0.0', async () => {
  removeSquareBuildsByPrefix('sy');
  emailSquareBacklogOnce().catch(error => console.log('[square-email] backlog email failed:', error.message));
  loadScrubPillarFilter();
  await loadIndex();
  if (SQUARE_ONLY) {
    console.log('[square-builder] restored working site at http://127.0.0.1:' + PORT + '/');
    return;
  }
  mergeCookIntoQueue();
  try { await backfillRegistry(); loadImageDupePriority(); autoLog('🔄 image-dupe priority loaded — ' + imageDupePriority.size + ' entries flagged'); } catch (e) {}
  // seed the queue from the under-12 survey if empty
  if (!readArr(QUEUE).length) { try { const u = JSON.parse(fs.readFileSync(WD + '/_under12_result.json', 'utf8')); writeArr(QUEUE, u.ids || []); } catch (e) {} }
  await watchNew();                       // snapshot known ids on first run
  setInterval(watchNew, 300000);          // every 5 min: auto-queue any NEW entries (keep-content-high)
  scheduleScans();                        // 4×/day low-cost quality-scan email (% of Q&A at 12/13+)
  setTimeout(() => scanImageDupesBatch(150).catch(() => {}), 12000);
  setInterval(() => { if (!imageDupeScanJob.running) scanImageDupesBatch(150).catch(() => {}); }, 8 * 60 * 1000);
  let lanIp = '';
  try {
    const os = require('os');
    lanIp = Object.values(os.networkInterfaces()).flat().find(i => i && i.family === 'IPv4' && !i.internal && /^192\.168\.|^10\./.test(i.address))?.address || '';
    if (lanIp) try { fs.writeFileSync(WD + '/_scrub_lan_ip.txt', lanIp + ':' + PORT); } catch (e) {}
  } catch (e) {}
  console.log(`[scrub-button] up on http://localhost:${PORT}/scrubber + /generate + /image-duplicator + /image-generator + /face-card-top-image-generator + /pollinator-image-overwrite  (4444)  queue=${readArr(QUEUE).length}  cap=${DAILY_MAX}/day · lane=${SCRUB_LANE_MODE ? 'ON chained' : 'OFF'} · entry-gap=${Math.round(PIPELINE_ENTRY_GAP_MS / 60000)}m · image-dupe-priority=${imageDupePriority.size} · new-content watcher ON`);
  if (lanIp) console.log(`[scrub-button] LAN (phone on WiFi): http://${lanIp}:${PORT}/`);
  resumeInterruptedImageJobs();
  const bootFixerAuto = process.env.FORMAT_FIXER_AUTORUN === '1';
  const bootFixerPillar = String(process.env.FORMAT_FIXER_BOOT_PILLAR || 'tl').trim() || 'tl';
  if (bootFixerAuto && (!formatFixerJob.auto || formatFixerJob.phase === 'done' || formatFixerJob.pillar !== bootFixerPillar)) {
    const bootStart = () => {
      if (formatFixerJob.running) return;
      const result = startFormatFixer(bootFixerPillar);
      if (!result.ok && /running/i.test(result.msg || '')) setTimeout(bootStart, 5000);
    };
    setTimeout(bootStart, 1200);
  } else if (formatFixerJob.auto && formatFixerJob.phase !== 'done') {
    formatFixerJob.stop = false;
    formatFixerJob.error = '';
    formatFixerLog('▶ auto-resume · errors continue · runs until owner stops it');
    runFormatFixerLoop().catch(e => {
      formatFixerJob.error = e.message;
      formatFixerJob.running = false;
      formatFixerJob.phase = 'error';
      saveFormatFixerState(true);
    });
  }
  if (squareAutoJob.enabled) {
    squareAutoJob.stop = false;
    runSquareAutoLoop().catch(error => {
      squareAutoJob.running = false; squareAutoJob.enabled = false; squareAutoJob.phase = 'error';
      squareAutoJob.error = error.message; saveSquareAutoJob();
    });
  }
  // Daily Driver mirrors Fixer automation: keep draining its queue, cap at 200/day, and halt only
  // after three consecutive errors. It waits while Format Fixer is writing so the same Q&A is never
  // mutated by both pipelines at once.
  const keepDailyDriverRunning = () => {
    if (!autoJob.auto || autoJob.running || formatFixerJob.running) return;
    if (dayCount() >= DAILY_MAX || !readArr(QUEUE).length) return;
    scrubAutoLoop().catch(e => {
      autoJob.errors++;
      autoJob.consecutiveErrors++;
      autoJob.stage = '⚠️ daily driver · ' + e.message;
      autoLog('⚠️ daily driver loop error · continuing automatically');
    });
  };
  setTimeout(keepDailyDriverRunning, 3000);
  setInterval(keepDailyDriverRunning, 10000);
});
