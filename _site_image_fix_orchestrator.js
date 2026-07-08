// Site-wide image fix: (1) ranking lists → template + all product imgs, no hero
//                      (2) essay answers → no hero + occasional section imgs
// Progress: _site_image_fix_progress.json · Stop: _site_image_fix_stop.flag
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const PROGRESS_F = WD + '/_site_image_fix_progress.json';
const STATE_F = WD + '/_site_image_fix_state.json';
const LOG_F = WD + '/_site_image_fix.log';
const STOP = WD + '/_site_image_fix_stop.flag';

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
const { prepareEntryForPublish } = require('./_write_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const args = process.argv.slice(2);
const REAPPLY = args.includes('--reapply');
const PHASE_ONLY = (args.find(a => a.startsWith('--phase=')) || '').split('=')[1] || '';

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

function writeProgress(patch) {
  let cur = {};
  try { cur = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}
  fs.writeFileSync(PROGRESS_F, JSON.stringify(Object.assign({}, cur, patch, { at: new Date().toISOString() }), null, 2));
}

async function saveEssayEntry(store, idx, id, title, body, existing) {
  const grade = gradeEntry(id, body);
  const now = Date.now();
  const pre = (String(id).match(/^[a-z]+/) || [''])[0];
  const tags = (existing && existing.tags) || [pre];
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

async function buildQueues(store, onScan) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = idx.entries || [];
  const ranking = [];
  const essays = [];
  let scanned = 0;
  for (const row of entries) {
    scanned++;
    if (!row || !row.id || !/^[a-z]+\d/i.test(row.id)) continue;
    const title = row.question || '';
    if (onScan && scanned % 200 === 0) onScan({ scanned, total: entries.length, ranking: ranking.length, essays: essays.length });

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
      ranking.push({ id: row.id, title });
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
    essays.push({ id: row.id, title });
  }
  ranking.sort((a, b) => a.id.localeCompare(b.id));
  essays.sort((a, b) => a.id.localeCompare(b.id));
  return { idx, ranking, essays };
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}

  let state = { rankingDone: [], essayDone: [], rankingFailed: [], essayFailed: [], samples: [] };
  if (!REAPPLY) {
    try { state = Object.assign(state, JSON.parse(fs.readFileSync(STATE_F, 'utf8'))); } catch (e) {}
  } else {
    log('Full reapply (--reapply)');
  }

  writeProgress({
    running: true,
    phase: 'queue-scan',
    stage: 'scanning index',
    ranking: { fixed: 0, total: 0, failed: 0, remaining: 0 },
    essays: { fixed: 0, total: 0, failed: 0, remaining: 0 },
    note: 'Site-wide: ranking lists get product imgs each; essays get occasional section imgs; no top heroes',
    samples: state.samples || [],
    startedAt: new Date().toISOString(),
  });

  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const { idx, ranking, essays } = await buildQueues(store, snap => {
    writeProgress({
      phase: 'queue-scan',
      stage: 'scanning index ' + snap.scanned + '/' + snap.total,
      ranking: { fixed: 0, total: snap.ranking, failed: 0, remaining: snap.ranking },
      essays: { fixed: 0, total: snap.essays, failed: 0, remaining: snap.essays },
    });
    log('Scan ' + snap.scanned + '/' + snap.total + ' · rankQ=' + snap.ranking + ' · essayQ=' + snap.essays);
  });

  const rankDone = new Set(REAPPLY ? [] : (state.rankingDone || []));
  const essayDone = new Set(REAPPLY ? [] : (state.essayDone || []));
  const rankQueue = ranking.filter(q => !rankDone.has(q.id));
  const essayQueue = essays.filter(q => !essayDone.has(q.id));

  writeProgress({
    running: true,
    phase: PHASE_ONLY || 'ranking-images',
    ranking: { fixed: rankDone.size, total: ranking.length, failed: (state.rankingFailed || []).length, remaining: rankQueue.length },
    essays: { fixed: essayDone.size, total: essays.length, failed: (state.essayFailed || []).length, remaining: essayQueue.length },
    stage: 'queue-ready',
  });

  log('Site queue · ranking=' + rankQueue.length + '/' + ranking.length + ' · essays=' + essayQueue.length + '/' + essays.length);

  async function runRanking() {
    if (PHASE_ONLY && PHASE_ONLY !== 'ranking') return;
    writeProgress({ phase: 'ranking-images' });
    for (const item of rankQueue) {
      if (fs.existsSync(STOP)) break;
      writeProgress({ currentId: item.id, currentTitle: item.title, stage: 'ranking product images' });
      log('RANK-IMG ' + item.id);
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        const body = await rebuildRankingProductImages(item.id, item.title, existing.answer, {});
        await saveRankingEntry(store, idx, item.id, item.title, body, existing, FORMAT_V_IMAGES);
        const check = await spotCheckEntry(item.id, body, item.title);
        state.rankingDone.push(item.id);
        if (state.rankingDone.length === 1 || state.rankingDone.length % 10 === 0) {
          state.samples = [{ at: new Date().toISOString(), phase: 'ranking', ...check, url: pillarUrl(item.id) }, ...(state.samples || [])].slice(0, 10);
        }
        writeProgress({
          ranking: { fixed: state.rankingDone.length, total: ranking.length, failed: (state.rankingFailed || []).length, remaining: rankQueue.length - state.rankingDone.length },
          lastCheck: check,
          samples: state.samples,
          stage: check.pass ? 'ranking-ok' : 'ranking-warn',
        });
        log('OK ' + item.id + ' prodImgs=' + check.productImgs + '/' + check.wantProduct);
      } catch (e) {
        state.rankingFailed = state.rankingFailed || [];
        state.rankingFailed.push({ id: item.id, err: e.message, at: new Date().toISOString() });
        log('ERR ' + item.id + ' · ' + e.message);
        writeProgress({ ranking: { failed: state.rankingFailed.length } });
      }
      if (state.rankingDone.length % 25 === 0) await store.setJSON('_index.json', idx);
      fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
      await sleep(300);
    }
  }

  async function runEssays() {
    if (PHASE_ONLY && PHASE_ONLY !== 'essays') return;
    writeProgress({ phase: 'essay-images' });
    for (const item of essayQueue) {
      if (fs.existsSync(STOP)) break;
      writeProgress({ currentId: item.id, currentTitle: item.title, stage: 'essay section images' });
      log('ESSAY-IMG ' + item.id);
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        const body = await rebuildEssayOccasionalImages(item.id, item.title, existing.answer, {});
        const saved = await saveEssayEntry(store, idx, item.id, item.title, body, existing);
        state.essayDone.push(item.id);
        if (state.essayDone.length === 1 || state.essayDone.length % 25 === 0) {
          state.samples = [{ at: new Date().toISOString(), phase: 'essay', id: item.id, title: item.title, imgs: saved.imgs, grade: saved.grade, url: pillarUrl(item.id) }, ...(state.samples || [])].slice(0, 10);
        }
        writeProgress({
          essays: { fixed: state.essayDone.length, total: essays.length, failed: (state.essayFailed || []).length, remaining: essayQueue.length - state.essayDone.length },
          samples: state.samples,
          stage: 'essay-ok',
        });
        log('OK ' + item.id + ' sectionImgs=' + saved.imgs);
      } catch (e) {
        state.essayFailed = state.essayFailed || [];
        state.essayFailed.push({ id: item.id, err: e.message, at: new Date().toISOString() });
        log('ERR ' + item.id + ' · ' + e.message);
        writeProgress({ essays: { failed: state.essayFailed.length } });
      }
      if (state.essayDone.length % 50 === 0) await store.setJSON('_index.json', idx);
      fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
      await sleep(200);
    }
  }

  await runRanking();
  await runEssays();
  await store.setJSON('_index.json', idx);

  writeProgress({
    running: false,
    phase: 'complete',
    ranking: { fixed: state.rankingDone.length, total: ranking.length, failed: (state.rankingFailed || []).length, remaining: 0 },
    essays: { fixed: state.essayDone.length, total: essays.length, failed: (state.essayFailed || []).length, remaining: 0 },
    currentId: null,
    currentTitle: null,
    stage: 'complete',
  });
  log('Site image fix complete · ranking=' + state.rankingDone.length + ' essays=' + state.essayDone.length);
})().catch(e => {
  log('FATAL ' + e.message);
  writeProgress({ running: false, stage: 'fatal', lastError: e.message });
  process.exit(1);
});
