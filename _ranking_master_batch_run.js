// Shared ranking-list master batch runner — pillar via argv or first positional.
const fs = require('fs');
const PILLARS = require('./_ranking_master_pillar_config');

const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const {
  isRankingListBody,
  titleSuggestsRankingList,
  rankingListHasTopHero,
  auditRankingListMaster,
} = require('./_ranking_list_master_law');
const { FORMAT_V, applyRankingMasterTemplate } = require('./_ranking_list_rebuild_lib');
const { finalizeIndexNow } = require('./_write_lib');

function runBatch(pillarKey) {
  const cfg = PILLARS[pillarKey];
  if (!cfg) throw new Error('Unknown pillar: ' + pillarKey);

  const PROGRESS_F = WD + '/' + cfg.progressF;
  const LOG_F = WD + '/' + cfg.logF;
  const STOP = WD + '/' + cfg.stopF;
  const STATE_F = WD + '/' + cfg.stateF;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const args = process.argv.slice(2);
  const LIMIT = parseInt((args.find(a => a.startsWith('--limit=')) || '').split('=')[1] || '0', 10) || 0;
  const ONE = (args.find(a => a.startsWith('--id=')) || '').split('=')[1] || '';
  const RESET = args.includes('--reset');
  const REAPPLY = args.includes('--reapply');

  function log(msg) {
    const line = new Date().toISOString() + ' ' + msg;
    console.log(line);
    try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
  }

  function writeProgress(patch) {
    let cur = {};
    try { cur = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}
    fs.writeFileSync(PROGRESS_F, JSON.stringify(Object.assign({}, cur, patch, { at: new Date().toISOString(), format_v: FORMAT_V, pillar: cfg.key }), null, 2));
  }

  function needsFix(id, body, title, entry) {
    if (!isRankingListBody(body, title) && !titleSuggestsRankingList(title)) return false;
    if (rankingListHasTopHero(body)) return true;
    if (entry && entry.format_v !== FORMAT_V) return true;
    if (entry && entry.cover_src !== 'no-hero') return true;
    const audit = auditRankingListMaster(body, title);
    if (audit.applies && !audit.compliant) return true;
    return false;
  }

  function pillarUrl(id) {
    return 'https://pulserevops.com/' + cfg.hub + '/' + id;
  }

  async function loadQueue(store) {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const rows = (idx.entries || []).filter(e => e && cfg.idRe.test(e.id));
    const queue = [];
    for (const row of rows) {
      const title = row.question || '';
      if (!titleSuggestsRankingList(title)) continue;
      try {
        const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
        const body = e && e.answer ? e.answer : '';
        if (!body) continue;
        if (!isRankingListBody(body, title) && !titleSuggestsRankingList(title)) continue;
        if (!needsFix(row.id, body, title, e, row)) continue;
        queue.push({ id: row.id, title: title || row.question || row.id });
      } catch (e) {}
    }
    queue.sort((a, b) => a.id.localeCompare(b.id));
    return queue;
  }

  async function fixOne(store, idx, item) {
    const entry = await store.get('answers/' + item.id + '.json', { type: 'json' });
    if (!entry || !entry.answer) throw new Error('missing entry');
    const body = applyRankingMasterTemplate(item.id, entry.answer, item.title);
    const firstProd = (body.match(/@@PRODUCT[^\n]* img="([^"]+)"/) || [])[1] || '';
    const now = Date.now();
    entry.answer = body;
    entry.format_v = FORMAT_V;
    entry.cover_src = 'no-hero';
    entry.polished_at = now;
    await store.setJSON('answers/' + item.id + '.json', entry);

    const i = (idx.entries || []).findIndex(e => e && e.id === item.id);
    const row = {
      id: item.id,
      question: item.title,
      format_v: FORMAT_V,
      cover_src: 'no-hero',
      img: firstProd || '',
      polished_at: now,
    };
    if (i >= 0) idx.entries[i] = Object.assign({}, idx.entries[i], row);
    else idx.entries.unshift(row);

    const grade = gradeEntry(item.id, body);
    const audit = auditRankingListMaster(body, item.title);
    return {
      id: item.id,
      title: item.title,
      url: pillarUrl(item.id),
      grade: grade.score,
      pass: audit.compliant && grade.score >= 12,
      masterIssues: audit.issues || [],
    };
  }

  return (async () => {
    try { fs.unlinkSync(STOP); } catch (e) {}

    let state = { done: [], failed: [], samples: [], fixedCount: 0, strategy: 'master-no-hero', pillar: cfg.key };
    if (RESET || REAPPLY) {
      log(REAPPLY ? 'Reapply all (--reapply)' : 'State reset (--reset)');
    } else {
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
      pillar: cfg.key,
      pillarLabel: cfg.label,
      strategy: 'master-no-hero',
      total: (state.done || []).length + queue.length,
      remaining: queue.length,
      fixed: REAPPLY ? 0 : (state.done || []).length,
      failed: REAPPLY ? 0 : (state.failed || []).length,
      currentId: null,
      currentTitle: null,
      stage: 'starting',
      note: cfg.label + ' — full master template, no top hero, tail sections added',
      samples: state.samples || [],
      startedAt: new Date().toISOString(),
    });

    log('Queue: ' + queue.length + ' · pillar=' + cfg.key + ' · strategy=master-no-hero');

    for (const item of queue) {
      if (fs.existsSync(STOP)) {
        log('Stop flag — exiting');
        break;
      }
      writeProgress({ currentId: item.id, currentTitle: item.title, stage: 'master template' });
      log('FIX ' + item.id + ' · ' + item.title);
      try {
        const check = await fixOne(store, idx, item);
        if ((state.fixedCount || 0) % 25 === 0) {
          await store.setJSON('_index.json', idx);
        }
        state.done = state.done || [];
        state.fixedCount = (state.fixedCount || 0) + 1;
        if (!state.done.includes(item.id)) state.done.push(item.id);
        state.samples = state.samples || [];
        if (state.fixedCount === 1 || state.fixedCount % 10 === 0) {
          state.samples.unshift(Object.assign({ at: new Date().toISOString() }, check));
          state.samples = state.samples.slice(0, 8);
        }
        state.recent = [check, ...(state.recent || [])].slice(0, 5);
        fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
        writeProgress({
          fixed: state.done.length,
          fixedCount: state.fixedCount,
          remaining: Math.max(0, queue.length - state.fixedCount + (state.failed || []).length),
          failed: (state.failed || []).length,
          lastCheck: check,
          samples: state.samples,
          stage: check.pass ? 'published' : 'published-warn',
        });
        log('OK ' + item.id + ' grade=' + check.grade + (check.masterIssues.length ? ' issues=' + check.masterIssues.join(',') : ''));
        if (state.fixedCount % 50 === 0) {
          try { await finalizeIndexNow(item.id, store, { id: item.id, question: item.title }); } catch (e) {}
        }
      } catch (e) {
        state.failed = state.failed || [];
        state.failed.push({ id: item.id, title: item.title, err: e.message, at: new Date().toISOString() });
        fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
        writeProgress({ failed: state.failed.length, stage: 'error', lastError: e.message });
        log('ERR ' + item.id + ' · ' + e.message);
      }
      await sleep(200);
    }

    await store.setJSON('_index.json', idx);
    writeProgress({
      running: false,
      stage: 'complete',
      fixed: (state.done || []).length,
      failed: (state.failed || []).length,
      remaining: 0,
      currentId: null,
      currentTitle: null,
    });
    log('Batch complete · fixed=' + (state.done || []).length + ' failed=' + (state.failed || []).length);
  })().catch(e => {
    log('FATAL ' + e.message);
    writeProgress({ running: false, stage: 'fatal', lastError: e.message });
    process.exit(1);
  });
}

module.exports = { runBatch };

if (require.main === module) {
  const key = process.argv.find(a => a.startsWith('--pillar='))?.split('=')[1] || process.argv[2] || 'aq';
  runBatch(key);
}
