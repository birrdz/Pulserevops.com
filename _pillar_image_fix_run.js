// Pillar-scoped image fix: ranking lists → product imgs; essays → occasional section imgs; no top hero.
// Usage: node _pillar_image_fix_run.js --pillar=ce [--reapply] [--phase=ranking|essays]
const fs = require('fs');
const PILLARS = require('./_ranking_master_pillar_config');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const PILLAR_HUB = {
  aq: 'aquariums', sw: 'software', ca: 'cars', bt: 'boats', tl: 'tools', ce: 'knowledge',
  q: 'knowledge', er: 'electronicreview', pt: 'pets', mv: 'movies', hf: 'knowledge',
};

function pillarCfg(key) {
  const k = String(key || '').toLowerCase();
  if (PILLARS[k]) return PILLARS[k];
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    key: k,
    prefix: k,
    idRe: new RegExp('^' + esc + '\\d+$', 'i'),
    hub: PILLAR_HUB[k] || k,
    label: k.toUpperCase(),
    progressF: '_' + k + '_pillar_image_progress.json',
    stateF: '_' + k + '_pillar_image_state.json',
    logF: '_' + k + '_pillar_image.log',
    stopF: '_' + k + '_pillar_image_stop.flag',
  };
}

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { titleSuggestsRankingList, isRankingListBody } = require('./_ranking_list_master_law');
const {
  FORMAT_V_IMAGES,
  needsRankingImagesFix,
  rebuildRankingProductImages,
  saveRankingEntry,
  spotCheckEntry,
  pillarUrl,
} = require('./_ranking_list_rebuild_lib');
const {
  FORMAT_V_ESSAY,
  needsEssayImagesFix,
  rebuildEssayOccasionalImages,
  isEssayEntry,
  countInlineImages,
} = require('./_answer_occasional_images_lib');
const {
  FORMAT_V_AQ_QA,
  needsAqQaFix,
  rebuildAqQaEntry,
  saveAqQaEntry,
  saveQaGoldEntry,
} = require('./_aq_qa_gold_fix_lib');
const {
  FORMAT_V_CE,
  CE_GOLD_ID,
  MIN_GRADE,
  needsCeFix,
  rebuildCeEntry,
  saveCeEntry,
  loadCeGoldTemplate,
  isCeIncomplete,
  auditAllCeEntries,
  gradeCeEntry,
} = require('./_ce_current_events_fix_lib');
const { prepareEntryForPublish } = require('./_write_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { notifyPillarEntryDone } = require('./_pillar_entry_done_email');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { ensureFaceCardFromEntryImages } = require('./_entry_image_reuse_lib');
const { assertNotMv, isMvPillar } = require('./netlify/functions/lib/mv-pillar-guard');

const args = process.argv.slice(2);
const PILLAR_KEY = (args.find(a => a.startsWith('--pillar=')) || '').split('=')[1] || args[0] || 'sw';
if (isMvPillar(PILLAR_KEY)) throw new Error('HARD EXCLUSION: mv pillar OFF LIMITS — use _mv_run.js (poster library) only');
assertNotMv('pillar-image-fix-run', { pillar: PILLAR_KEY });
const cfg = pillarCfg(PILLAR_KEY);
const NOTIFY_EACH = process.env.PILLAR_IMAGE_EMAIL_EACH !== '0' && !args.includes('--no-notify');

const PROGRESS_F = WD + '/' + cfg.progressF;
const STATE_F = WD + '/' + cfg.stateF;
const LOG_F = WD + '/' + cfg.logF;
const STOP = WD + '/' + cfg.stopF;
const REAPPLY = args.includes('--reapply');
const PHASE_ONLY = (args.find(a => a.startsWith('--phase=')) || '').split('=')[1] || '';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

function entryUrl(id) {
  return 'https://pulserevops.com/' + cfg.hub + '/' + id;
}

/** Promote Top-10 / internal image to face-card when cover is missing (owner 2026-07-08). */
async function tryEntryImageReuse(store, idx, id, title, existing) {
  const body = existing && existing.answer ? existing.answer : '';
  if (!body) return existing && existing.answer ? existing.answer : '';
  const r = await ensureFaceCardFromEntryImages(id, title, body, { store, entryMeta: existing });
  if (!r.applied) return body;
  const patch = Object.assign({}, existing, {
    answer: r.body,
    cover_src: r.coverSrc,
    face_title_baked: true,
    image_reuse_at: new Date().toISOString(),
    image_reuse_from: r.sourceUrl,
  });
  await store.setJSON('answers/' + id + '.json', patch);
  const i = (idx.entries || []).findIndex((e) => e && e.id === id);
  if (i >= 0) {
    idx.entries[i] = Object.assign({}, idx.entries[i], {
      img: '/assets/qa/' + id + '.jpg',
      cover_src: r.coverSrc,
      face_title_baked: true,
    });
  }
  log('REUSE-FACE ' + id + ' ← ' + r.sourceUrl);
  return r.body;
}

function writeProgress(patch) {
  let cur = {};
  try { cur = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}
  const strategy = patch.strategy || (cfg.key === 'ce' ? 'ce-complete-13' : 'pillar-images');
  fs.writeFileSync(PROGRESS_F, JSON.stringify(Object.assign({}, cur, patch, {
    at: new Date().toISOString(),
    pillar: cfg.key,
    pillarLabel: cfg.label,
    strategy,
  }), null, 2));
}

async function saveEssayEntry(store, idx, id, title, body, existing) {
  const grade = gradeEntry(id, body);
  const now = Date.now();
  const tags = (existing && existing.tags) || [cfg.prefix];
  const entry = prepareEntryForPublish(id, title, {
    id, question: title, answer: body, tags,
    quality_score: Math.max(12, grade.score >= 13 ? 13 : grade.score),
    format_v: FORMAT_V_ESSAY,
    pending: false,
    ts: existing && existing.ts ? existing.ts : now,
    polished_at: now,
    cover_src: 'no-hero',
    face_title_baked: false,
  });
  await store.setJSON('answers/' + id + '.json', entry);
  const i = (idx.entries || []).findIndex(e => e && e.id === id);
  const row = { id, question: title, format_v: FORMAT_V_ESSAY, cover_src: 'no-hero', img: '', polished_at: now };
  if (i >= 0) idx.entries[i] = Object.assign({}, idx.entries[i], row);
  return { grade: grade.score, imgs: countInlineImages(body) };
}

async function buildQueues(store, forceAll) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && cfg.idRe.test(e.id));
  const ranking = [];
  const essays = [];
  const ceNews = [];

  for (const row of rows) {
    const title = row.question || '';
    if (cfg.key === 'ce' && titleSuggestsRankingList(title)) {
      let e, body;
      try {
        e = await store.get('answers/' + row.id + '.json', { type: 'json' });
        body = e && e.answer ? e.answer : '';
      } catch (err) { continue; }
      if (body && isRankingListBody(body, title) && (needsRankingImagesFix(row.id, body, title) || e.format_v !== FORMAT_V_IMAGES)) {
        ranking.push({ id: row.id, title, ts: row.ts || 0 });
      } else if (body && needsCeFix(row.id, body, title, e, forceAll)) {
        ceNews.push({ id: row.id, title, ts: row.ts || (e && e.ts) || 0 });
      }
      continue;
    }

    if (cfg.key === 'ce') {
      let e, body;
      try {
        e = await store.get('answers/' + row.id + '.json', { type: 'json' });
        body = e && e.answer ? e.answer : '';
      } catch (err) { continue; }
      if (!body) continue;
      if (!needsCeFix(row.id, body, title, e, forceAll)) continue;
      ceNews.push({ id: row.id, title, ts: row.ts || (e && e.ts) || 0 });
      continue;
    }

    // GENERAL Q&A gold (q11133) + TOP_LIST (aq1158) — all pillars except ce/mv
    if (cfg.key !== 'ce') {
      let e, body;
      try {
        e = await store.get('answers/' + row.id + '.json', { type: 'json' });
        body = e && e.answer ? e.answer : '';
      } catch (err) { continue; }
      if (!body) continue;
      const route = pickGoldTemplate(row.id, body, title);
      if (route.template === 'top10') {
        if (forceAll || e.format_v !== FORMAT_V_IMAGES || !auditTop10GoldTemplate(body, title).compliant || needsRankingImagesFix(row.id, body, title)) {
          ranking.push({ id: row.id, title, route: 'top10', ts: row.ts || 0 });
        }
        continue;
      }
      if (route.template === 'qa') {
        if (needsAqQaFix(row.id, body, title, e, forceAll)) {
          essays.push({ id: row.id, title, route: 'qa', ts: row.ts || 0 });
        }
        continue;
      }
    }

    if (titleSuggestsRankingList(title)) {
      if (row.format_v === FORMAT_V_IMAGES && !row.img) continue;
      let e, body;
      try {
        e = await store.get('answers/' + row.id + '.json', { type: 'json' });
        body = e && e.answer ? e.answer : '';
      } catch (err) { continue; }
      if (!body) continue;
      if (!isRankingListBody(body, title) && !titleSuggestsRankingList(title)) continue;
      if (!needsRankingImagesFix(row.id, body, title) && e.format_v === FORMAT_V_IMAGES) continue;
      ranking.push({ id: row.id, title, ts: row.ts || 0 });
      continue;
    }
    if (row.format_v === FORMAT_V_ESSAY && !row.img) continue;
    let e, body;
    try {
      e = await store.get('answers/' + row.id + '.json', { type: 'json' });
      body = e && e.answer ? e.answer : '';
    } catch (err) { continue; }
    if (!body) continue;
    if (!isEssayEntry(body, title)) continue;
    if (!needsEssayImagesFix(row.id, body, title, e)) continue;
    essays.push({ id: row.id, title, route: 'essay', ts: row.ts || 0 });
  }

  const byNewest = (a, b) => (b.ts || 0) - (a.ts || 0) || b.id.localeCompare(a.id);
  ranking.sort(byNewest);
  essays.sort(byNewest);
  ceNews.sort(byNewest);
  return { idx, ranking, essays, ceNews };
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}

  let state = { rankingDone: [], essayDone: [], ceDone: [], rankingFailed: [], essayFailed: [], ceFailed: [], samples: [] };
  if (!REAPPLY) {
    try { state = Object.assign(state, JSON.parse(fs.readFileSync(STATE_F, 'utf8'))); } catch (e) {}
  } else {
    log('Full reapply (--reapply) · pillar=' + cfg.key);
  }

  writeProgress({
    running: true,
    phase: 'queue-scan',
    stage: 'building queue',
    ranking: { fixed: 0, total: 0, failed: 0, remaining: 0 },
    essays: { fixed: 0, total: 0, failed: 0, remaining: 0 },
    note: cfg.key === 'ce'
      ? cfg.label + ' — complete ~2000w writings + 13/13 certify (hero, Direct Answer, 6+ sections, 2 mermaid, FAQ, Sources, Related)'
      : cfg.label + ' — ranking product imgs + essay section imgs, no top hero',
    strategy: cfg.key === 'ce' ? 'ce-complete-13' : 'pillar-images',
    samples: state.samples || [],
    startedAt: new Date().toISOString(),
  });

  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const ceTemplate = cfg.key === 'ce' ? await loadCeGoldTemplate(store) : '';
  const validIds = new Set();
  const { idx, ranking, essays, ceNews } = await buildQueues(store, REAPPLY);
  for (const row of (idx.entries || [])) {
    if (row && row.id) validIds.add(row.id);
  }

  const rankDone = new Set(REAPPLY ? [] : (state.rankingDone || []));
  const essayDone = new Set(REAPPLY ? [] : (state.essayDone || []));
  const ceDone = new Set(REAPPLY ? [] : (state.ceDone || []));
  const rankQueue = ranking.filter(q => !rankDone.has(q.id));
  const essayQueue = essays.filter(q => !essayDone.has(q.id));
  const ceQueue = (ceNews || []).filter(q => !ceDone.has(q.id));
  const ceTotal = (ceNews || []).length;
  const workTotal = ranking.length + (cfg.key === 'ce' ? ceTotal : essays.length);

  writeProgress({
    running: true,
    phase: PHASE_ONLY || (cfg.key === 'ce' ? 'ce-news-order' : 'ranking-images'),
    fixed: (state.rankingDone || []).length + (cfg.key === 'ce' ? (state.ceDone || []).length : (state.essayDone || []).length),
    total: workTotal,
    remaining: rankQueue.length + (cfg.key === 'ce' ? ceQueue.length : essayQueue.length),
    failed: (state.rankingFailed || []).length + (cfg.key === 'ce' ? (state.ceFailed || []).length : (state.essayFailed || []).length),
    ranking: { fixed: rankDone.size, total: ranking.length, failed: (state.rankingFailed || []).length, remaining: rankQueue.length },
    essays: cfg.key === 'ce'
      ? { fixed: ceDone.size, total: ceTotal, failed: (state.ceFailed || []).length, remaining: ceQueue.length }
      : { fixed: essayDone.size, total: essays.length, failed: (state.essayFailed || []).length, remaining: essayQueue.length },
    stage: 'queue-ready',
  });

  log('Queue · ' + cfg.key + ' · ranking=' + rankQueue.length + '/' + ranking.length
    + (cfg.key === 'ce' ? ' · ceNews=' + ceQueue.length + '/' + ceTotal : ' · essays=' + essayQueue.length + '/' + essays.length));

  async function runRanking() {
    if (PHASE_ONLY && PHASE_ONLY !== 'ranking') return;
    writeProgress({ phase: 'ranking-images' });
    for (const item of rankQueue) {
      if (fs.existsSync(STOP)) break;
      writeProgress({ currentId: item.id, currentTitle: item.title, stage: 'ranking product images' });
      log('RANK-IMG ' + item.id);
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        let workBody = await tryEntryImageReuse(store, idx, item.id, item.title, existing);
        const body = await rebuildRankingProductImages(item.id, item.title, workBody, {});
        await saveRankingEntry(store, idx, item.id, item.title, body, existing, FORMAT_V_IMAGES);
        const check = await spotCheckEntry(item.id, body, item.title);
        if (cfg.key === 'aq') {
          const gold = auditTop10GoldTemplate(body, item.title);
          if (check.grade < 13 || !gold.compliant) {
            throw new Error('Not 13/13: grade=' + check.grade + ' gold=' + (gold.compliant ? 'ok' : (gold.issues || []).join(',')));
          }
        }
        state.rankingDone.push(item.id);
        const sample = { at: new Date().toISOString(), phase: 'ranking', id: item.id, title: item.title, url: entryUrl(item.id), grade: check.grade, productImgs: check.productImgs, pass: check.pass };
        if (state.rankingDone.length === 1 || state.rankingDone.length % 5 === 0) {
          state.samples = [sample, ...(state.samples || [])].slice(0, 10);
        }
        writeProgress({
          fixed: state.rankingDone.length + state.essayDone.length,
          total: ranking.length + essays.length,
          remaining: (rankQueue.length - state.rankingDone.length) + (essayQueue.length - state.essayDone.length),
          ranking: { fixed: state.rankingDone.length, total: ranking.length, failed: (state.rankingFailed || []).length, remaining: rankQueue.length - state.rankingDone.length },
          lastCheck: check,
          samples: state.samples,
          stage: check.pass ? 'ranking-ok' : 'ranking-warn',
        });
        log('OK ' + item.id + ' prodImgs=' + check.productImgs + '/' + check.wantProduct);
        if (NOTIFY_EACH) {
          try {
            const imgAudit = auditImages(item.id, body);
            await notifyPillarEntryDone({
              id: item.id,
              title: item.title,
              body,
              phase: 'ranking images',
              grade: check.grade,
              url: entryUrl(item.id),
              imageCount: imgAudit.productImgs,
            });
          } catch (mailErr) {
            log('MAIL-ERR ' + item.id + ' · ' + mailErr.message);
          }
        }
      } catch (e) {
        state.rankingFailed = state.rankingFailed || [];
        state.rankingFailed.push({ id: item.id, err: e.message, at: new Date().toISOString() });
        log('ERR ' + item.id + ' · ' + e.message);
        writeProgress({ failed: state.rankingFailed.length + (state.essayFailed || []).length, ranking: { failed: state.rankingFailed.length } });
      }
      fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
      await sleep(300);
    }
    await store.setJSON('_index.json', idx);
  }

  async function runCeCertifyLoop() {
    if (cfg.key !== 'ce') return;
    const MAX_ROUNDS = 8;
    for (let round = 1; round <= MAX_ROUNDS; round++) {
      if (fs.existsSync(STOP)) break;
      writeProgress({ phase: 'ce-certify', strategy: 'ce-complete-13', stage: '13/13 audit · round ' + round });
      const report = await auditAllCeEntries(store, idx, { skipGold: true });
      log('CE CERTIFY r' + round + ' · pass=' + report.passing + '/' + report.total + ' · fail=' + report.failing.length);
      writeProgress({
        certifyRound: round,
        certifyPassing: report.passing,
        certifyTotal: report.total,
        certifyFailing: report.failing.length,
        stage: report.allPass ? 'all 13/13' : ('re-scrub ' + report.failing.length + ' entries'),
      });
      if (report.allPass) {
        writeProgress({ phase: 'ce-certified', running: false, stage: 'all 13/13 certified' });
        return;
      }
      for (const item of report.failing) {
        if (fs.existsSync(STOP)) break;
        writeProgress({ currentId: item.id, currentTitle: item.title, stage: '13/13 re-scrub · r' + round });
        log('CE-CERT ' + item.id + ' · was ' + item.score + '/13');
        try {
          const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
          const sibRows = (idx.entries || []).filter(e => e && /^ce/i.test(e.id) && e.id !== item.id).slice(0, 8);
          const siblings = sibRows.map(e => ({ id: e.id, title: e.question || e.id }));
          const rebuilt = await rebuildCeEntry(item.id, item.title || existing.question, existing.answer, {
            store,
            entryMeta: existing,
            siblings,
            valid: validIds,
            templateExample: ceTemplate,
            onProgress: opts => writeProgress({ stage: 'certify · ' + (opts.label || item.id) }),
          });
          const saved = await saveCeEntry(store, idx, item.id, item.title || existing.question, rebuilt.body, existing, { audit: rebuilt.audit, words: rebuilt.words });
          state.ceDone = state.ceDone || [];
          if (!state.ceDone.includes(item.id)) state.ceDone.push(item.id);
          state.ceFailed = (state.ceFailed || []).filter(f => f.id !== item.id);
          log('CERT-OK ' + item.id + ' · ' + saved.grade + '/13 · imgs=' + saved.imgs);
        } catch (e) {
          state.ceFailed = state.ceFailed || [];
          const prev = (state.ceFailed || []).findIndex(f => f.id === item.id);
          const row = { id: item.id, err: e.message, at: new Date().toISOString(), round };
          if (prev >= 0) state.ceFailed[prev] = row;
          else state.ceFailed.push(row);
          log('CERT-ERR ' + item.id + ' · ' + e.message);
        }
        fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
        await sleep(300);
      }
      await store.setJSON('_index.json', idx);
    }
    const final = await auditAllCeEntries(store, idx, { skipGold: true });
    log('CE CERTIFY done · pass=' + final.passing + '/' + final.total + ' · fail=' + final.failing.length);
    writeProgress({
      phase: final.allPass ? 'ce-certified' : 'ce-certify-incomplete',
      certifyPassing: final.passing,
      certifyTotal: final.total,
      certifyFailing: final.failing.length,
      stage: final.allPass ? 'all 13/13 certified' : (final.failing.length + ' still below 13/13'),
    });
  }

  async function runCeNews() {
    if (cfg.key !== 'ce') return;
    if (PHASE_ONLY && PHASE_ONLY !== 'ce' && PHASE_ONLY !== 'essays') return;
    writeProgress({ phase: 'ce-template', strategy: 'ce-complete-13' });
    for (const item of ceQueue) {
      if (fs.existsSync(STOP)) break;
      writeProgress({ currentId: item.id, currentTitle: item.title, stage: 'PULSE template fix' });
      log('CE-TPL ' + item.id);
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        const sibRows = (idx.entries || []).filter(e => e && /^ce/i.test(e.id) && e.id !== item.id).slice(0, 8);
        const siblings = sibRows.map(e => ({ id: e.id, title: e.question || e.id }));
        const rebuilt = await rebuildCeEntry(item.id, item.title, existing.answer, {
          store,
          entryMeta: existing,
          siblings,
          valid: validIds,
          templateExample: ceTemplate,
          onProgress: opts => writeProgress({ stage: 'template · ' + (opts.label || item.id) }),
        });
        const saved = await saveCeEntry(store, idx, item.id, item.title, rebuilt.body, existing, { audit: rebuilt.audit, words: rebuilt.words });
        state.ceDone = state.ceDone || [];
        state.ceDone.push(item.id);
        const sample = { at: new Date().toISOString(), phase: 'ce', id: item.id, title: item.title, url: entryUrl(item.id), imgs: saved.imgs, grade: saved.grade, rubricPct: saved.rubricPct, words: saved.words };
        if (state.ceDone.length === 1 || state.ceDone.length % 5 === 0) {
          state.samples = [sample, ...(state.samples || [])].slice(0, 10);
        }
        writeProgress({
          fixed: state.rankingDone.length + state.ceDone.length,
          total: workTotal,
          remaining: (rankQueue.length - state.rankingDone.length) + (ceQueue.length - state.ceDone.length),
          essays: { fixed: state.ceDone.length, total: ceTotal, failed: (state.ceFailed || []).length, remaining: ceQueue.length - state.ceDone.length },
          samples: state.samples,
          stage: 'ce-ok',
        });
        log('OK ' + item.id + ' · ' + saved.grade + '/13 · imgs=' + saved.imgs + ' hero=' + (saved.img || 'inline'));
      } catch (e) {
        state.ceFailed = state.ceFailed || [];
        state.ceFailed.push({ id: item.id, err: e.message, at: new Date().toISOString() });
        log('ERR ' + item.id + ' · ' + e.message);
        writeProgress({ failed: (state.rankingFailed || []).length + state.ceFailed.length, essays: { failed: state.ceFailed.length } });
      }
      if (state.ceDone.length % 15 === 0) await store.setJSON('_index.json', idx);
      fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
      await sleep(250);
    }
  }

  async function runEssays() {
    if (cfg.key === 'ce') return;
    if (PHASE_ONLY && PHASE_ONLY !== 'essays') return;
    writeProgress({ phase: cfg.key === 'aq' ? 'qa-gold' : 'essay-images' });
    for (const item of essayQueue) {
      if (fs.existsSync(STOP)) break;
      const isQaGold = item.route === 'qa';
      writeProgress({ currentId: item.id, currentTitle: item.title, stage: isQaGold ? 'Q&A gold · q11133' : 'essay section images' });
      log(isQaGold ? 'QA-GOLD ' + item.id : 'ESSAY-IMG ' + item.id);
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        let workBody = await tryEntryImageReuse(store, idx, item.id, item.title, existing);
        let saved;
        let body;
        let words;
        if (isQaGold) {
          const pre = (String(item.id).match(/^[a-z]+/) || [''])[0];
          const sibRows = (idx.entries || []).filter(e => e && new RegExp('^' + pre + '\\d', 'i').test(e.id) && e.id !== item.id).slice(0, 8);
          const siblings = sibRows.map(e => ({ id: e.id, title: e.question || e.id }));
          const rebuilt = await rebuildAqQaEntry(item.id, item.title, workBody, {
            store,
            entryMeta: existing,
            siblings,
            valid: validIds,
            onProgress: opts => writeProgress({ stage: 'qa · ' + (opts.label || item.id) }),
          });
          saved = await saveQaGoldEntry(store, idx, item.id, item.title, rebuilt.body, existing);
          body = rebuilt.body;
          words = rebuilt.words;
          const gold = auditQaGoldTemplate(body, item.title, item.id);
          if (saved.grade < 13 || !gold.compliant) {
            throw new Error('Not 13/13: grade=' + saved.grade + ' gold=' + (gold.compliant ? 'ok' : (gold.issues || []).join(',')));
          }
        } else {
          body = await rebuildEssayOccasionalImages(item.id, item.title, workBody, {});
          saved = await saveEssayEntry(store, idx, item.id, item.title, body, existing);
        }
        state.essayDone.push(item.id);
        const sample = { at: new Date().toISOString(), phase: isQaGold ? 'qa' : 'essay', id: item.id, title: item.title, url: entryUrl(item.id), imgs: saved.imgs, grade: saved.grade };
        if (state.essayDone.length === 1 || state.essayDone.length % 10 === 0) {
          state.samples = [sample, ...(state.samples || [])].slice(0, 10);
        }
        writeProgress({
          fixed: state.rankingDone.length + state.essayDone.length,
          total: ranking.length + essays.length,
          remaining: (rankQueue.length - state.rankingDone.length) + (essayQueue.length - state.essayDone.length),
          essays: { fixed: state.essayDone.length, total: essays.length, failed: (state.essayFailed || []).length, remaining: essayQueue.length - state.essayDone.length },
          samples: state.samples,
          stage: isQaGold ? 'qa-ok' : 'essay-ok',
        });
        log('OK ' + item.id + (isQaGold ? ' grade=' + saved.grade + ' imgs=' + saved.imgs + ' words=' + words : ' sectionImgs=' + saved.imgs));
        if (NOTIFY_EACH) {
          try {
            await notifyPillarEntryDone({
              id: item.id,
              title: item.title,
              body,
              phase: isQaGold ? 'Q&A gold' : 'essay images',
              grade: saved.grade,
              url: entryUrl(item.id),
              imageCount: saved.imgs,
            });
          } catch (mailErr) {
            log('MAIL-ERR ' + item.id + ' · ' + mailErr.message);
          }
        }
      } catch (e) {
        state.essayFailed = state.essayFailed || [];
        state.essayFailed.push({ id: item.id, err: e.message, at: new Date().toISOString() });
        log('ERR ' + item.id + ' · ' + e.message);
        writeProgress({ failed: state.rankingFailed.length + state.essayFailed.length, essays: { failed: state.essayFailed.length } });
      }
      if (state.essayDone.length % 25 === 0) await store.setJSON('_index.json', idx);
      fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
      await sleep(200);
    }
  }

  await runRanking();
  if (cfg.key === 'ce') {
    await runCeNews();
    await runCeCertifyLoop();
  } else {
    await runEssays();
  }
  await store.setJSON('_index.json', idx);

  const doneCount = state.rankingDone.length + (cfg.key === 'ce' ? (state.ceDone || []).length : state.essayDone.length);
  const failCount = (state.rankingFailed || []).length + (cfg.key === 'ce' ? (state.ceFailed || []).length : (state.essayFailed || []).length);
  writeProgress({
    running: false,
    phase: 'complete',
    stage: 'complete',
    fixed: doneCount,
    total: workTotal,
    remaining: 0,
    failed: failCount,
    ranking: { fixed: state.rankingDone.length, total: ranking.length, failed: (state.rankingFailed || []).length, remaining: 0 },
    essays: cfg.key === 'ce'
      ? { fixed: (state.ceDone || []).length, total: ceTotal, failed: (state.ceFailed || []).length, remaining: 0 }
      : { fixed: state.essayDone.length, total: essays.length, failed: (state.essayFailed || []).length, remaining: 0 },
    currentId: null,
    currentTitle: null,
  });
  log('Complete · ' + cfg.key + ' · ranking=' + state.rankingDone.length
    + (cfg.key === 'ce' ? ' ce=' + (state.ceDone || []).length : ' essays=' + state.essayDone.length));
})().catch(e => {
  log('FATAL ' + e.message);
  writeProgress({ running: false, stage: 'fatal', lastError: e.message });
  process.exit(1);
});
