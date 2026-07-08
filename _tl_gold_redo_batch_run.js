// CRO Pulse Tools pillar (tl) — dual gold template redo (Top 10 aq1158 + Q&A q11133).
// Usage: node _tl_gold_redo_batch_run.js [--reapply] [--limit=N] [--id=tl1234] [--qa-only] [--shard=0/3] [--slow] [--entry-ms=N]
// Parallel: 3 workers split queue by index (i % N === shard) — disjoint ids, 1 min stagger via _tl_gold_redo_launch_3.js
// Slow/doc1 pacing: --slow or BATCH_ENTRY_MS=120000 → 1 entry every 2 min (bypasses speedup gate, not deploy gate)
// 🔒 Image/provider law LOCKED — 20s floor + adaptive learner, DDG↔Pollinator alternation via _image_provider_alternate.js
process.env.IMAGE_PROVIDER_COOLDOWN_MS = process.env.IMAGE_PROVIDER_COOLDOWN_MS || '15000';
process.env.POLLINATOR_FREQ_MS = process.env.POLLINATOR_FREQ_MS || '20000';
process.env.DDG_THROTTLE_COOLDOWN_MS = process.env.DDG_THROTTLE_COOLDOWN_MS || '15000';
process.env.DDG_DELAY_MS = process.env.DDG_DELAY_MS || '15000';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

let PROGRESS_F = WD + '/_tl_gold_redo_progress.json';
let STATE_F = WD + '/_tl_gold_redo_batch_state.json';
let LOG_F = WD + '/_tl_gold_redo_batch.log';
let STOP = WD + '/_tl_gold_redo_batch_stop.flag';
const STOP_ALL = WD + '/_tl_gold_redo_batch_stop.flag';
const EMAIL_STOP = WD + '/_tl_gold_redo_progress_email_stop.flag';
const CROSSOVER_F = WD + '/_CROSSOVER.md';

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate, TOP10_GOLD_ID, QA_GOLD_ID } = require('./_pulse_gold_template_router');
const {
  spotCheckEntry,
  pillarUrl,
  FORMAT_V_IMAGES,
} = require('./_ranking_list_rebuild_lib');
const { auditTop10GoldTemplate, appliesTop10Gold } = require('./_ranking_top10_gold_template');
const { needsAqTop10Fix, rebuildAqTop10Entry, saveAqTop10Entry } = require('./_aq_top10_gold_fix_lib');
const { needsAqQaFix, rebuildAqQaEntry, saveAqQaEntry } = require('./_aq_qa_gold_fix_lib');
const { auditQaGoldTemplate, appliesQaGold } = require('./_qa_gold_template');
const { learnLogLine } = require('./_image_provider_alternate');
const { dsChat } = require('./_ds_lib');
const { notifyTl1313Entry } = require('./_tl_1313_entry_email');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { guardSpeedup, guardBatchProgress, gateSnapshot } = require('./_render_audit_gate');
const { makePipelineTemplateRun } = require('./_pipeline_template_log');
const { contentRubricAudit } = require('./_format_fixer_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const {
  DUP_AFTER,
  canUseAnswerDup,
  pickDupSource,
  adaptDupBody,
  registerCertifiedAnswer,
  rebuildDupQaEntry,
  isGeoDupTarget,
  findPillarGeoSource,
} = require('./_tl_answer_dup_lib');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

const shardArg = (args.find(a => a.startsWith('--shard=')) || '').split('=')[1] || '';
let SHARD_INDEX = parseInt(process.env.TL_SHARD_INDEX || '0', 10);
let SHARD_COUNT = parseInt(process.env.TL_SHARD_COUNT || '1', 10);
if (shardArg && shardArg.includes('/')) {
  const parts = shardArg.split('/');
  const i = parseInt(parts[0], 10);
  const n = parseInt(parts[1], 10);
  if (!isNaN(i) && !isNaN(n) && n > 0) {
    SHARD_INDEX = i;
    SHARD_COUNT = n;
  }
}
if (SHARD_COUNT > 1) {
  const tag = '_w' + SHARD_INDEX;
  STATE_F = WD + '/_tl_gold_redo_batch_state' + tag + '.json';
  LOG_F = WD + '/_tl_gold_redo_batch' + tag + '.log';
  STOP = WD + '/_tl_gold_redo_batch_stop' + tag + '.flag';
  PROGRESS_F = WD + '/_tl_gold_redo_progress' + tag + '.json';
}

function shouldStop() {
  if (fs.existsSync(STOP)) return true;
  if (SHARD_COUNT > 1 && fs.existsSync(STOP_ALL)) return true;
  return false;
}

function loadShardState(w) {
  try {
    return JSON.parse(fs.readFileSync(WD + '/_tl_gold_redo_batch_state_w' + w + '.json', 'utf8'));
  } catch (e) {
    return null;
  }
}

function fixCount(state) {
  let n = (state.rankingDone || []).length + (state.qaDone || []).length;
  if (SHARD_COUNT <= 1) return n;
  for (let w = 0; w < SHARD_COUNT; w++) {
    if (w === SHARD_INDEX) continue;
    const st = loadShardState(w);
    if (st) n += (st.rankingDone || []).length + (st.qaDone || []).length;
  }
  return n;
}

function mergedAnswerPool(localPool) {
  const seen = new Set();
  const out = [];
  const push = (row) => {
    if (!row || !row.id || seen.has(row.id)) return;
    seen.add(row.id);
    out.push(row);
  };
  for (const row of localPool || []) push(row);
  if (SHARD_COUNT <= 1) return out;
  for (let w = 0; w < SHARD_COUNT; w++) {
    if (w === SHARD_INDEX) continue;
    const st = loadShardState(w);
    if (st) for (const row of st.answerPool || []) push(row);
  }
  return out;
}

/** Blob repair batch runs at normal pace; log render gate but only throw in explicit speedup mode. */
function guardBatchOrQaBlob(action) {
  const g = gateSnapshot();
  const speedupMode = process.env.BATCH_SPEEDUP === '1' || args.includes('--speedup');
  if (g.deployBlocked) {
    log('Gate note (' + action + '): deployBlocked — tl blob repair continues');
  }
  if (g.speedupBlocked) {
    log('Gate note (' + action + '): speedupBlocked — ' + (speedupMode ? 'speedup mode blocked' : 'normal-paced batch continues'));
  }
  if (speedupMode && g.speedupBlocked) {
    return action === 'batch-progress' ? guardBatchProgress() : guardSpeedup(action);
  }
  return g;
}

const REAPPLY = args.includes('--reapply');
const QA_ONLY = args.includes('--qa-only');
const NOTIFY_QA_ONLY = args.includes('--notify-qa-only');
const SLOW_PACE = args.includes('--slow') || process.env.BATCH_SLOW === '1';
const LIMIT = parseInt((args.find(a => a.startsWith('--limit=')) || '').split('=')[1] || '0', 10) || 0;
const ONE = (args.find(a => a.startsWith('--id=')) || '').split('=')[1] || '';
const ENTRY_CD_MS = parseInt(process.env.TL_BATCH_CD_MS || process.env.BATCH_ENTRY_CD_MS || '25000', 10);
const ENTRY_MS = parseInt(
  process.env.BATCH_ENTRY_MS
    || process.env.BATCH_ENTRY_DELAY_MS
    || (args.find(a => a.startsWith('--entry-ms=')) || '').split('=')[1]
    || (SLOW_PACE ? '120000' : String(ENTRY_CD_MS)),
  10,
) || ENTRY_CD_MS;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function entryGapMs(phase) {
  return ENTRY_MS > 0 ? ENTRY_MS : (phase === 'ranking' ? 300 : ENTRY_CD_MS);
}

async function maybeNotify1313(item, body, template, grade, extra) {
  if (NOTIFY_QA_ONLY && template !== 'qa') return;
  if (grade < 13) return;
  try {
    const r = await notifyTl1313Entry(Object.assign({
      id: item.id,
      title: item.title,
      body,
      template,
      grade,
      url: entryUrl(item.id),
    }, extra || {}));
    if (r.sent) log('MAIL-OK ' + item.id + ' · ' + template + ' · ' + (r.subject || ''));
    else log('MAIL-SKIP ' + item.id + ' · ' + template + ' · ' + (r.reason || 'unknown'));
  } catch (mailErr) {
    log('MAIL-ERR ' + item.id + ' · ' + mailErr.message);
  }
}

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

const ctx = { state: null, rankQueue: [], qaQueue: [] };

function writeProgress(patch) {
  let cur = {};
  try { cur = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}
  const st = ctx.state || {};
  const rankQueue = ctx.rankQueue || [];
  const qaQueue = ctx.qaQueue || [];
  const doneIds = [...(st.rankingDone || []), ...(st.qaDone || [])];
  const rankRem = Math.max(0, rankQueue.length - (st.rankingDone || []).length);
  const qaRem = Math.max(0, qaQueue.length - (st.qaDone || []).length);
  const rankFailed = (st.rankingFailed || []).length;
  const qaFailed = (st.qaFailed || []).length;
  fs.writeFileSync(PROGRESS_F, JSON.stringify(Object.assign({}, cur, patch, {
    at: new Date().toISOString(),
    pillar: 'tl',
    pillarLabel: 'CRO Pulse Tools',
    strategy: 'dual-gold-redo',
    shard: SHARD_COUNT > 1 ? SHARD_INDEX + '/' + SHARD_COUNT : undefined,
    doneIds,
    remaining: rankRem + qaRem,
    failed: rankFailed + qaFailed,
    ranking: Object.assign({
      fixed: (st.rankingDone || []).length,
      total: rankQueue.length,
      failed: rankFailed,
      remaining: rankRem,
    }, (patch.ranking || {})),
    qa: Object.assign({
      fixed: (st.qaDone || []).length,
      total: qaQueue.length,
      failed: qaFailed,
      remaining: qaRem,
    }, (patch.qa || {})),
  }), null, 2));
}

function logCrossover(msg) {
  const line = '- **' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' ET:** ' + msg;
  try { fs.appendFileSync(CROSSOVER_F, line + '\n'); } catch (e) {}
}

async function finalizeBatch() {
  const st = ctx.state || {};
  const rankQueue = ctx.rankQueue || [];
  const qaQueue = ctx.qaQueue || [];
  const doneCount = (st.rankingDone || []).length + (st.qaDone || []).length;
  const failCount = (st.rankingFailed || []).length + (st.qaFailed || []).length;
  const doneIds = [...(st.rankingDone || []), ...(st.qaDone || [])];
  writeProgress({
    running: false,
    phase: 'complete',
    stage: 'complete',
    fixed: doneCount,
    remaining: 0,
    failed: failCount,
    ranking: { fixed: (st.rankingDone || []).length, total: rankQueue.length, failed: (st.rankingFailed || []).length, remaining: 0 },
    qa: { fixed: (st.qaDone || []).length, total: qaQueue.length, failed: (st.qaFailed || []).length, remaining: 0 },
    currentId: null,
    currentTitle: null,
    doneIds,
    completedAt: new Date().toISOString(),
  });
  try { fs.writeFileSync(STOP, 'complete'); } catch (e) {}
  try { fs.writeFileSync(EMAIL_STOP, 'complete'); } catch (e) {}
  logCrossover('🔧 **TL dual-gold redo COMPLETE** — ranking **' + (st.rankingDone || []).length + '/' + rankQueue.length
    + '** · Q&A **' + (st.qaDone || []).length + '/' + qaQueue.length
    + '** · failed **' + failCount + '** · stop flags set · resume: clear flags + `node _tl_gold_redo_batch_run.js`');
  log('Complete · ranking=' + (st.rankingDone || []).length + ' qa=' + (st.qaDone || []).length + ' failed=' + failCount + ' · ' + learnLogLine());
  try {
    const { execSync } = require('child_process');
    execSync('node _tl_gold_redo_progress_email.js --once --final', { cwd: WD, stdio: 'inherit', timeout: 120000 });
  } catch (e) {
    log('Final email ERR · ' + e.message);
  }
}

function entryUrl(id) {
  return pillarUrl(id);
}

async function stampPipelineRun(store, id, route, scoreHistory, certified, steps) {
  const run = makePipelineTemplateRun({
    id,
    classification: route,
    template: route.template,
    goldId: route.goldId,
    scoreHistory: scoreHistory || [],
    steps: steps || [],
    certified: !!certified,
  });
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) {
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
        pipeline_template_run: run,
        pipeline_origin: 'tl-gold-redo',
      }));
    }
  } catch (e) {}
  return run;
}

function assertLockedTemplate(item, body, title) {
  const route = pickGoldTemplate(item.id, body, title);
  if (route.template !== item.route.template) {
    throw new Error('template drift blocked: queued ' + item.route.template + ' vs body ' + route.template);
  }
  if (item.route.template === 'qa' && !appliesQaGold(item.id, body, { title })) {
    throw new Error('Q&A gold law: appliesQaGold failed for ' + item.id);
  }
  if (item.route.template === 'top10' && !appliesTop10Gold(body, title)) {
    throw new Error('Top 10 gold law: appliesTop10Gold failed for ' + item.id);
  }
  return route;
}

function verifyQaCertified(id, title, body, route) {
  assertLockedTemplate({ id, route, title }, body, title);
  const gold = auditQaGoldTemplate(body, title, id);
  const rubric = contentRubricAudit(id, body, { title, qaGoldOutline: true });
  const grade = gradeEntry(id, body);
  if (!gold.compliant) throw new Error('gold audit: ' + (gold.issues || []).join(', '));
  if (!rubric.pass) throw new Error('rubric: ' + (rubric.failed || []).join(', '));
  if (grade.score < 13) throw new Error('grade ' + grade.score + '/13: ' + (grade.missing || []).join(', '));
  return { gold, rubric, grade: grade.score };
}

function verifyTop10Certified(id, title, body, route) {
  assertLockedTemplate({ id, route, title }, body, title);
  const gold = auditTop10GoldTemplate(body, title);
  const grade = gradeEntry(id, body);
  if (!gold.compliant) throw new Error('gold audit: ' + (gold.issues || []).join(', '));
  if (grade.score < 13) throw new Error('grade ' + grade.score + '/13');
  return { gold, grade: grade.score };
}

async function buildQueues(store, forceAll) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && /^tl\d+$/i.test(e.id));
  const ranking = [];
  const qa = [];
  const skipped = [];

  for (const row of rows) {
    if (row.id === TOP10_GOLD_ID || row.id === QA_GOLD_ID) {
      skipped.push({ id: row.id, reason: 'gold_reference_immutable' });
      continue;
    }
    const title = row.question || '';

    // --reapply on large pillars: title-only classify, skip per-entry blob fetch (body loaded on fix).
    if (forceAll) {
      const route = pickGoldTemplate(row.id, '', title);
      if (route.template === 'top10') {
        ranking.push({ id: row.id, title, route, ts: row.ts || 0 });
      } else if (route.template === 'qa') {
        qa.push({ id: row.id, title, route, ts: row.ts || 0 });
      } else {
        skipped.push({ id: row.id, reason: route.reason });
      }
      continue;
    }

    let e, body;
    try {
      e = await store.get('answers/' + row.id + '.json', { type: 'json' });
      body = e && e.answer ? e.answer : '';
    } catch (err) {
      skipped.push({ id: row.id, reason: 'missing_blob' });
      continue;
    }
    if (!body) {
      skipped.push({ id: row.id, reason: 'empty_body' });
      continue;
    }

    const route = pickGoldTemplate(row.id, body, title);
    if (route.template === 'top10') {
      if (needsAqTop10Fix(row.id, body, title, e, forceAll)) {
        ranking.push({ id: row.id, title, route, ts: row.ts || 0 });
      }
    } else if (route.template === 'qa') {
      if (needsAqQaFix(row.id, body, title, e, forceAll)) {
        qa.push({ id: row.id, title, route, ts: row.ts || 0 });
      }
    } else {
      skipped.push({ id: row.id, reason: route.reason });
    }
  }

  const byNewest = (a, b) => (b.ts || 0) - (a.ts || 0) || b.id.localeCompare(a.id);
  ranking.sort(byNewest);
  qa.sort(byNewest);
  return { idx, ranking, qa, skipped, total: rows.length };
}

if (require.main === module) {
(async () => {
  if (DRY_RUN) {
    const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
    const { ranking, qa, skipped, total } = await buildQueues(store, true);
    const out = {
      pillar: 'tl',
      total,
      rankingNeedFix: ranking.length,
      qaNeedFix: qa.length,
      skipped: skipped.length,
      reapply: true,
    };
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  try { fs.unlinkSync(STOP); } catch (e) {}
  try { fs.unlinkSync(EMAIL_STOP); } catch (e) {}
  if (SLOW_PACE || ENTRY_MS > 0) {
    log('Slow pace · doc1 every ' + Math.round(ENTRY_MS / 1000) + 's (ENTRY_MS=' + ENTRY_MS + ')');
  }
  guardBatchOrQaBlob('batch-start');

  let state = { rankingDone: [], qaDone: [], rankingFailed: [], qaFailed: [], samples: [], answerPool: [] };
  if (!REAPPLY) {
    try { state = Object.assign(state, JSON.parse(fs.readFileSync(STATE_F, 'utf8'))); } catch (e) {}
  } else {
    log('Full reapply (--reapply) — fresh checkpoint');
    try { fs.unlinkSync(STATE_F); } catch (e) {}
    try { fs.unlinkSync(WD + '/_tl_gold_redo_progress_email_ping.json'); } catch (e) {}
  }

  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const { idx, ranking, qa, skipped, total } = await buildQueues(store, REAPPLY);

  const validIds = new Set();
  for (const row of (idx.entries || [])) {
    if (row && row.id) validIds.add(row.id);
  }

  let rankQueue = ranking.filter(q => REAPPLY || !(state.rankingDone || []).includes(q.id));
  let qaQueue = qa.filter(q => REAPPLY || !(state.qaDone || []).includes(q.id));

  if (ONE) {
    const all = [...ranking, ...qa];
    const hit = all.find(q => q.id === ONE);
    rankQueue = hit && hit.route.template === 'top10' ? [hit] : [];
    qaQueue = hit && hit.route.template === 'qa' ? [hit] : [];
    if (!hit) throw new Error('ID not in queue: ' + ONE);
  }

  if (QA_ONLY) {
    rankQueue = [];
    log('QA-only mode (--qa-only) — skipping Top 10 ranking queue');
  }

  if (LIMIT > 0) {
    rankQueue = rankQueue.slice(0, LIMIT);
    qaQueue = qaQueue.slice(0, Math.max(0, LIMIT - rankQueue.length));
  }

  if (SHARD_COUNT > 1) {
    rankQueue = rankQueue.filter((q, i) => i % SHARD_COUNT === SHARD_INDEX);
    qaQueue = qaQueue.filter((q, i) => i % SHARD_COUNT === SHARD_INDEX);
    log('SHARD ' + SHARD_INDEX + '/' + SHARD_COUNT + ' → ranking=' + rankQueue.length + ' qa=' + qaQueue.length);
  }

  const workTotal = rankQueue.length + qaQueue.length;
  ctx.state = state;
  ctx.rankQueue = rankQueue;
  ctx.qaQueue = qaQueue;

  writeProgress({
    running: true,
    phase: 'starting',
    stage: 'queue-ready',
    total: total,
    queued: workTotal,
    ranking: { fixed: 0, total: rankQueue.length, failed: 0, remaining: rankQueue.length },
    qa: { fixed: 0, total: qaQueue.length, failed: 0, remaining: qaQueue.length },
    skipped: skipped.length,
    note: 'CRO Pulse Tools redo — PIPELINE TEMPLATE LAW: classify→gold shape→13/13 only; Top10=aq1158 Q&A=q11133; after ' + DUP_AFTER + ' fixes dup ONLY for geo-swap / same-angle twins (never lazy cross-bucket)'
      + (ENTRY_MS > 0 ? '; slow doc1 every ' + Math.round(ENTRY_MS / 60000) + ' min' : ''),
    dupAfter: DUP_AFTER,
    answerPoolSize: (state.answerPool || []).length,
    entryMs: ENTRY_MS || undefined,
    slowPace: SLOW_PACE || ENTRY_MS >= 120000 || undefined,
    ruleFile: '.cursor/rules/pipeline-template-law.mdc',
    routerFile: '_pulse_gold_template_router.js',
    imageProviderLaw: '_image_provider_alternate.js',
    startedAt: new Date().toISOString(),
    samples: state.samples || [],
  });

  log('Queue · tl total=' + total + ' · ranking=' + rankQueue.length + '/' + ranking.length
    + ' · qa=' + qaQueue.length + '/' + qa.length + ' · skipped=' + skipped.length);
  logCrossover('🔧 **TL dual-gold redo STARTED** — queue **' + rankQueue.length + ' Top 10 + ' + qaQueue.length + ' Q&A**'
    + ' (' + total + ' total tl entries) · golden template law · 13/13 only · after ' + DUP_AFTER + ' fixes dup ONLY when sensible (geo/angle twin)'
    + ' · per-entry emails → koryjordanwhite@gmail.com');

  async function runRanking() {
    writeProgress({ phase: 'ranking-top10' });
    for (const item of rankQueue) {
      if (shouldStop()) break;
      guardBatchOrQaBlob('batch-progress');
      writeProgress({ running: true, currentId: item.id, currentTitle: item.title, stage: 'top10 gold · aq1158' });
      log('TOP10 ' + item.id + ' · ' + item.title);
      log('CLASSIFY ' + item.id + ' → ' + item.route.template + ' · ' + item.route.goldId + ' · ' + (item.route.reason || ''));
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        const rebuilt = await rebuildAqTop10Entry(item.id, item.title, existing.answer, {
          dsChat,
          onProgress: opts => writeProgress({ stage: 'top10 · ' + (opts.label || item.id) }),
        });
        const body = rebuilt.body;
        await saveAqTop10Entry(store, idx, item.id, item.title, body, existing);
        const check = await spotCheckEntry(item.id, body, item.title);
        const certified = verifyTop10Certified(item.id, item.title, body, item.route);
        await stampPipelineRun(store, item.id, item.route, [{ path: 'full', score: check.grade, at: new Date().toISOString() }], true, ['top10-rebuild']);
        const gold = certified.gold;
        if (check.grade < 13 || !gold.compliant || !check.masterOk) {
          throw new Error('Not 13/13: grade=' + check.grade + ' gold=' + (gold.compliant ? 'ok' : (gold.issues || []).join(',')) + ' master=' + (check.masterOk ? 'ok' : (check.masterIssues || []).join(',')));
        }
        state.rankingDone = state.rankingDone || [];
        state.rankingDone.push(item.id);
        const sample = {
          at: new Date().toISOString(),
          phase: 'top10',
          template: 'aq1158',
          id: item.id,
          title: item.title,
          url: entryUrl(item.id),
          grade: check.grade,
          goldOk: gold.compliant,
          pass: check.pass && gold.compliant,
        };
        if (state.rankingDone.length === 1 || state.rankingDone.length % 5 === 0) {
          state.samples = [sample, ...(state.samples || [])].slice(0, 10);
        }
        writeProgress({
          fixed: state.rankingDone.length + (state.qaDone || []).length,
          ranking: {
            fixed: state.rankingDone.length,
            total: rankQueue.length,
            failed: (state.rankingFailed || []).length,
            remaining: rankQueue.length - state.rankingDone.length,
          },
          lastCheck: sample,
          samples: state.samples,
          stage: sample.pass ? 'top10-ok' : 'top10-warn',
        });
        log('OK ' + item.id + ' grade=' + check.grade + ' gold=' + (gold.compliant ? 'pass' : gold.issues.join(',')));
        if (check.grade >= 13 && gold.compliant) {
          const imgAudit = auditImages(item.id, body);
          await maybeNotify1313(item, body, 'top10', check.grade, { imageCount: imgAudit.productImgs });
        }
      } catch (e) {
        state.rankingFailed = state.rankingFailed || [];
        state.rankingFailed.push({ id: item.id, err: e.message, at: new Date().toISOString() });
        log('ERR ' + item.id + ' · ' + e.message);
        writeProgress({ failed: (state.rankingFailed || []).length + (state.qaFailed || []).length });
      }
      fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
      if (state.rankingDone.length % 25 === 0) await store.setJSON('_index.json', idx);
      await sleep(entryGapMs('ranking'));
    }
    await store.setJSON('_index.json', idx);
  }

  async function runQa() {
    writeProgress({ phase: 'qa-gold' });
    for (const item of qaQueue) {
      if (shouldStop()) break;
      guardBatchOrQaBlob('batch-progress');
      writeProgress({ running: true, currentId: item.id, currentTitle: item.title, stage: 'Q&A gold · q11133' });
      log('QA ' + item.id + ' · ' + item.title);
      log('CLASSIFY ' + item.id + ' → ' + item.route.template + ' · ' + item.route.goldId + ' · ' + (item.route.reason || ''));
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        const sibRows = (idx.entries || []).filter(e => e && /^tl/i.test(e.id) && e.id !== item.id).slice(0, 8);
        const siblings = sibRows.map(e => ({ id: e.id, title: e.question || e.id }));
        const scoreHistory = [];
        const steps = [];
        let body;
        let words;
        let imgs;
        let dupFrom = '';

        const fc = fixCount(state);
        let dupMatch = null;
        // Geo-swap dup is allowed pillar-wide from the start (title-based); other
        // buckets (angle-twin) still wait for the DUP_AFTER combined-fix threshold.
        const geoTarget = isGeoDupTarget(item.title);
        if (canUseAnswerDup(fc) || geoTarget) {
          dupMatch = pickDupSource(item.title, mergedAnswerPool(state.answerPool));
          if (!dupMatch && geoTarget) {
            dupMatch = await findPillarGeoSource(item.title, { idx, store, selfId: item.id });
            if (dupMatch) log('DUP-PILLAR ' + item.id + ' ← ' + dupMatch.source.id + ' · ' + dupMatch.reason);
          }
          if (!dupMatch) {
            log('DUP-SKIP ' + item.id + ' · no sensible topical match (full rebuild)');
          }
        }
        if (dupMatch && dupMatch.source) {
          log('DUP-TRY ' + item.id + ' ← ' + dupMatch.source.id + ' mode=' + dupMatch.mode + ' · ' + dupMatch.reason);
          writeProgress({ stage: 'qa dup · ' + dupMatch.source.id });
          const adapted = await adaptDupBody(dupMatch.source.body, dupMatch.source.title, item.title, { dsChat });
          const dupBuilt = await rebuildDupQaEntry(item.id, item.title, adapted, {
            onProgress: opts => writeProgress({ stage: 'qa dup · ' + (opts.label || item.id) }),
          });
          steps.push('answer-dup:' + dupMatch.source.id);
          if (dupBuilt.ok) {
            body = dupBuilt.body;
            words = dupBuilt.words;
            dupFrom = dupMatch.source.id;
            scoreHistory.push({ path: 'dup', score: dupBuilt.grade, from: dupMatch.source.id, at: new Date().toISOString() });
          } else {
            log('DUP-FALLBACK ' + item.id + ' · ' + dupBuilt.reason);
            steps.push('dup-fallback:' + dupBuilt.reason);
          }
        }

        if (!body) {
          const rebuilt = await rebuildAqQaEntry(item.id, item.title, existing.answer, {
            store,
            entryMeta: existing,
            siblings,
            valid: validIds,
            dsChat,
            onProgress: opts => writeProgress({ stage: 'qa · ' + (opts.label || item.id) }),
          });
          body = rebuilt.body;
          words = rebuilt.words;
          steps.push('full-rebuild');
          scoreHistory.push({ path: 'full', score: rebuilt.grade, at: new Date().toISOString() });
        }

        const saved = await saveAqQaEntry(store, idx, item.id, item.title, body, existing);
        const certified = verifyQaCertified(item.id, item.title, body, item.route);
        await stampPipelineRun(store, item.id, item.route, scoreHistory, true, steps);
        if (saved.grade < 13 || certified.grade < 13) {
          throw new Error('Not 13/13: grade=' + saved.grade);
        }
        state.qaDone = state.qaDone || [];
        state.qaDone.push(item.id);
        state.answerPool = registerCertifiedAnswer(state.answerPool, { id: item.id, title: item.title, body });
        const sample = {
          at: new Date().toISOString(),
          phase: 'qa',
          template: 'q11133',
          id: item.id,
          title: item.title,
          url: entryUrl(item.id),
          grade: saved.grade,
          imgs: saved.imgs,
          words: words,
          goldOk: certified.gold.compliant,
          dupFrom: dupFrom || undefined,
          pass: certified.gold.compliant && saved.grade >= 13,
        };
        if (state.qaDone.length === 1 || state.qaDone.length % 5 === 0) {
          state.samples = [sample, ...(state.samples || [])].slice(0, 10);
        }
        writeProgress({
          fixed: (state.rankingDone || []).length + state.qaDone.length,
          qa: {
            fixed: state.qaDone.length,
            total: qaQueue.length,
            failed: (state.qaFailed || []).length,
            remaining: qaQueue.length - state.qaDone.length,
          },
          lastCheck: sample,
          samples: state.samples,
          stage: sample.pass ? 'qa-ok' : 'qa-warn',
        });
        log('OK ' + item.id + ' grade=' + saved.grade + ' imgs=' + saved.imgs + ' words=' + words
          + (dupFrom ? ' dup=' + dupFrom : '') + ' · ' + learnLogLine());
        await maybeNotify1313(item, body, 'qa', saved.grade, {
          wordCount: words,
          imageCount: saved.imgs,
          dupFrom,
        });
      } catch (e) {
        state.qaFailed = state.qaFailed || [];
        state.qaFailed.push({ id: item.id, err: e.message, at: new Date().toISOString() });
        log('ERR ' + item.id + ' · ' + e.message);
        writeProgress({ failed: (state.rankingFailed || []).length + state.qaFailed.length });
      }
      fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
      if (state.qaDone.length % 15 === 0) await store.setJSON('_index.json', idx);
      await sleep(entryGapMs('qa'));
    }
    await store.setJSON('_index.json', idx);
  }

  await runRanking();
  await runQa();

  await finalizeBatch();
})().catch(e => {
  log('FATAL ' + e.message);
  writeProgress({ running: false, stage: 'fatal', lastError: e.message });
  process.exit(1);
});
}
