// Product-image rebuild batch — re-fetch all @@PRODUCT imgs, no top hero.
const fs = require('fs');
const PILLARS = require('./_ranking_master_pillar_config');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const {
  titleSuggestsRankingList,
  isRankingListBody,
} = require('./_ranking_list_master_law');
const {
  FORMAT_V_IMAGES,
  needsRankingImagesFix,
  rebuildRankingProductImages,
  saveRankingEntry,
  spotCheckEntry,
  pillarUrl,
} = require('./_ranking_list_rebuild_lib');
const { finalizeIndexNow } = require('./_write_lib');

function runImagesBatch(pillarKey) {
  const cfg = PILLARS[pillarKey];
  if (!cfg) throw new Error('Unknown pillar: ' + pillarKey);

  const PROGRESS_F = WD + '/' + cfg.progressF;
  const LOG_F = WD + '/' + cfg.logF.replace('.log', '_images.log');
  const STOP = WD + '/' + cfg.stopF.replace('.flag', '_images_stop.flag');
  const STATE_F = WD + '/' + cfg.stateF.replace('.json', '_images_state.json');

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const args = process.argv.slice(2);
  const LIMIT = parseInt((args.find(a => a.startsWith('--limit=')) || '').split('=')[1] || '0', 10) || 0;
  const ONE = (args.find(a => a.startsWith('--id=')) || '').split('=')[1] || '';
  const REAPPLY = args.includes('--reapply');

  function log(msg) {
    const line = new Date().toISOString() + ' ' + msg;
    console.log(line);
    try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
  }

  function writeProgress(patch) {
    let cur = {};
    try { cur = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}
    fs.writeFileSync(PROGRESS_F, JSON.stringify(Object.assign({}, cur, patch, {
      at: new Date().toISOString(),
      format_v: FORMAT_V_IMAGES,
      pillar: cfg.key,
      strategy: 'images-rebuild',
    }), null, 2));
  }

  async function loadQueue(store) {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const queue = [];
    for (const row of (idx.entries || []).filter(e => e && cfg.idRe.test(e.id))) {
      const title = row.question || '';
      if (!titleSuggestsRankingList(title)) continue;
      try {
        const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
        const body = e && e.answer ? e.answer : '';
        if (!body) continue;
        if (!isRankingListBody(body, title) && !titleSuggestsRankingList(title)) continue;
        if (!needsRankingImagesFix(row.id, body, title) && e.format_v === FORMAT_V_IMAGES) continue;
        queue.push({ id: row.id, title });
      } catch (e) {}
    }
    queue.sort((a, b) => a.id.localeCompare(b.id));
    return queue;
  }

  return (async () => {
    try { fs.unlinkSync(STOP); } catch (e) {}

    let state = { done: [], failed: [], samples: [], fixedCount: 0, strategy: 'images-rebuild', pillar: cfg.key };
    if (!REAPPLY) {
      try { state = Object.assign(state, JSON.parse(fs.readFileSync(STATE_F, 'utf8'))); } catch (e) {}
    }

    const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
    let idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });

    let queue = ONE ? [{ id: ONE, title: '' }] : await loadQueue(store);
    if (ONE && !queue[0].title) {
      const e = await store.get('answers/' + ONE + '.json', { type: 'json' });
      queue[0].title = (e && e.question) || ONE;
    }

    const doneSet = REAPPLY ? new Set() : new Set(state.done || []);
    queue = queue.filter(q => !doneSet.has(q.id));
    if (LIMIT > 0) queue = queue.slice(0, LIMIT);

    writeProgress({
      running: true,
      pillarLabel: cfg.label,
      total: queue.length,
      remaining: queue.length,
      fixed: 0,
      failed: 0,
      stage: 'starting',
      note: cfg.label + ' — re-fetching all product images (no top hero)',
      samples: [],
      startedAt: new Date().toISOString(),
    });

    log('Image queue: ' + queue.length + ' · pillar=' + cfg.key);

    for (const item of queue) {
      if (fs.existsSync(STOP)) break;
      writeProgress({ currentId: item.id, currentTitle: item.title, stage: 'product images' });
      log('IMG ' + item.id + ' · ' + item.title);
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        const onProgress = (ev) => {
          const stage = ev.kind === 'product' ? 'product #' + ev.rank + ' fetch'
            : ev.kind === 'product-done' ? 'product #' + ev.rank + ' done'
            : 'working';
          writeProgress({ currentId: item.id, currentTitle: item.title, stage });
        };
        const body = await rebuildRankingProductImages(item.id, item.title, existing.answer, { onProgress });
        await saveRankingEntry(store, idx, item.id, item.title, body, existing, FORMAT_V_IMAGES);
        const check = await spotCheckEntry(item.id, body, item.title);
        check.url = pillarUrl(item.id);

        state.fixedCount = (state.fixedCount || 0) + 1;
        state.done = state.done || [];
        if (!state.done.includes(item.id)) state.done.push(item.id);
        if (state.fixedCount === 1 || state.fixedCount % 5 === 0) {
          state.samples = [{ at: new Date().toISOString(), ...check }, ...(state.samples || [])].slice(0, 8);
        }
        fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
        if (state.fixedCount % 10 === 0) await store.setJSON('_index.json', idx);

        writeProgress({
          fixed: state.done.length,
          fixedCount: state.fixedCount,
          remaining: Math.max(0, queue.length - state.fixedCount),
          failed: (state.failed || []).length,
          lastCheck: check,
          samples: state.samples,
          stage: check.pass ? 'images-ok' : 'images-warn',
        });
        log('OK ' + item.id + ' imgs=' + check.productImgs + '/' + check.wantProduct + ' grade=' + check.grade);
      } catch (e) {
        state.failed = state.failed || [];
        state.failed.push({ id: item.id, title: item.title, err: e.message, at: new Date().toISOString() });
        fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
        writeProgress({ failed: state.failed.length, stage: 'error', lastError: e.message });
        log('ERR ' + item.id + ' · ' + e.message);
      }
      await sleep(500);
    }

    await store.setJSON('_index.json', idx);
    writeProgress({ running: false, stage: 'complete', fixed: (state.done || []).length, failed: (state.failed || []).length, remaining: 0 });
    log('Image batch complete · fixed=' + (state.done || []).length + ' failed=' + (state.failed || []).length);
  })().catch(e => {
    log('FATAL ' + e.message);
    writeProgress({ running: false, stage: 'fatal', lastError: e.message });
    process.exit(1);
  });
}

module.exports = { runImagesBatch };

if (require.main === module) {
  const key = process.argv.find(a => a.startsWith('--pillar='))?.split('=')[1] || process.argv[2] || 'sw';
  runImagesBatch(key);
}
