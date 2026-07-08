// Aquariums pillar — dual gold template redo (Top 10 aq1158 + Q&A q11133).
// Usage: node _aq_gold_redo_batch_run.js [--reapply] [--limit=N] [--id=aq1234] [--qa-only] [--notify-qa-only] [--slow] [--entry-ms=N]
// Slow/doc1 pacing: --slow or BATCH_ENTRY_MS=120000 → 1 entry every 2 min (bypasses speedup gate, not deploy gate)
// 🔒 Image/provider law LOCKED — 20s floor + adaptive learner, DDG↔Pollinator alternation via _image_provider_alternate.js
process.env.IMAGE_PROVIDER_COOLDOWN_MS = process.env.IMAGE_PROVIDER_COOLDOWN_MS || '15000';
process.env.POLLINATOR_FREQ_MS = process.env.POLLINATOR_FREQ_MS || '20000';
process.env.DDG_THROTTLE_COOLDOWN_MS = process.env.DDG_THROTTLE_COOLDOWN_MS || '15000';
process.env.DDG_DELAY_MS = process.env.DDG_DELAY_MS || '15000';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const PROGRESS_F = WD + '/_aq_gold_redo_progress.json';
const STATE_F = WD + '/_aq_gold_redo_batch_state.json';
const LOG_F = WD + '/_aq_gold_redo_batch.log';
const STOP = WD + '/_aq_gold_redo_batch_stop.flag';
const EMAIL_STOP = WD + '/_aq_gold_redo_progress_email_stop.flag';
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
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { needsAqTop10Fix, rebuildAqTop10Entry, saveAqTop10Entry } = require('./_aq_top10_gold_fix_lib');
const { needsAqQaFix, rebuildAqQaEntry, saveAqQaEntry } = require('./_aq_qa_gold_fix_lib');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { learnLogLine } = require('./_image_provider_alternate');
const { dsChat } = require('./_ds_lib');
const { notifyAq1313Entry } = require('./_aq_1313_entry_email');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { guardSpeedup, guardBatchProgress, gateSnapshot } = require('./_render_audit_gate');

const args = process.argv.slice(2);

/** Blob repair batch runs at normal pace; log render gate but only throw in explicit speedup mode. */
function guardBatchOrQaBlob(action) {
  const g = gateSnapshot();
  const speedupMode = process.env.BATCH_SPEEDUP === '1' || args.includes('--speedup');
  if (g.deployBlocked) {
    log('Gate note (' + action + '): deployBlocked — aq blob repair continues');
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
const ENTRY_MS = parseInt(
  process.env.BATCH_ENTRY_MS
    || process.env.BATCH_ENTRY_DELAY_MS
    || (args.find(a => a.startsWith('--entry-ms=')) || '').split('=')[1]
    || (SLOW_PACE ? '120000' : '0'),
  10,
) || 0;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function entryGapMs(phase) {
  return ENTRY_MS > 0 ? ENTRY_MS : (phase === 'ranking' ? 300 : 400);
}

async function maybeNotify1313(item, body, template, grade, extra) {
  if (NOTIFY_QA_ONLY && template !== 'qa') return;
  if (grade < 13) return;
  try {
    const r = await notifyAq1313Entry(Object.assign({
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
    pillar: 'aq',
    pillarLabel: 'Aquariums',
    strategy: 'dual-gold-redo',
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
  logCrossover('🐠 **AQ dual-gold redo COMPLETE** — ranking **' + (st.rankingDone || []).length + '/' + rankQueue.length
    + '** · Q&A **' + (st.qaDone || []).length + '/' + qaQueue.length
    + '** · failed **' + failCount + '** · stop flags set · resume: clear flags + `node _aq_gold_redo_batch_run.js`');
  log('Complete · ranking=' + (st.rankingDone || []).length + ' qa=' + (st.qaDone || []).length + ' failed=' + failCount + ' · ' + learnLogLine());
  try {
    const { execSync } = require('child_process');
    execSync('node _aq_gold_redo_progress_email.js --once --final', { cwd: WD, stdio: 'inherit', timeout: 120000 });
  } catch (e) {
    log('Final email ERR · ' + e.message);
  }
}

function entryUrl(id) {
  return pillarUrl(id);
}

async function buildQueues(store, forceAll) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && /^aq\d+$/i.test(e.id));
  const ranking = [];
  const qa = [];
  const skipped = [];

  for (const row of rows) {
    if (row.id === TOP10_GOLD_ID || row.id === QA_GOLD_ID) {
      skipped.push({ id: row.id, reason: 'gold_reference_immutable' });
      continue;
    }
    const title = row.question || '';
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

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  try { fs.unlinkSync(EMAIL_STOP); } catch (e) {}
  if (SLOW_PACE || ENTRY_MS > 0) {
    log('Slow pace · doc1 every ' + Math.round(ENTRY_MS / 1000) + 's (ENTRY_MS=' + ENTRY_MS + ')');
  }
  guardBatchOrQaBlob('batch-start');

  let state = { rankingDone: [], qaDone: [], rankingFailed: [], qaFailed: [], samples: [] };
  if (!REAPPLY) {
    try { state = Object.assign(state, JSON.parse(fs.readFileSync(STATE_F, 'utf8'))); } catch (e) {}
  } else {
    log('Full reapply (--reapply) — fresh checkpoint');
    try { fs.unlinkSync(STATE_F); } catch (e) {}
    try { fs.unlinkSync(WD + '/_aq_gold_redo_progress_email_ping.json'); } catch (e) {}
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
    note: 'Aquarium redo — Top 10 entries use aq1158 law, Q&A entries use q11133 law; image/provider law locked (DDG↔Pollinator 20s floor + adaptive)'
      + (ENTRY_MS > 0 ? '; slow doc1 every ' + Math.round(ENTRY_MS / 60000) + ' min' : ''),
    entryMs: ENTRY_MS || undefined,
    slowPace: SLOW_PACE || ENTRY_MS >= 120000 || undefined,
    ruleFile: '.cursor/rules/pulse-template-selection.mdc',
    routerFile: '_pulse_gold_template_router.js',
    imageProviderLaw: '_image_provider_alternate.js',
    startedAt: new Date().toISOString(),
    samples: state.samples || [],
  });

  log('Queue · aq total=' + total + ' · ranking=' + rankQueue.length + '/' + ranking.length
    + ' · qa=' + qaQueue.length + '/' + qa.length + ' · skipped=' + skipped.length);

  async function runRanking() {
    writeProgress({ phase: 'ranking-top10' });
    for (const item of rankQueue) {
      if (fs.existsSync(STOP)) break;
      guardBatchOrQaBlob('batch-progress');
      writeProgress({ running: true, currentId: item.id, currentTitle: item.title, stage: 'top10 gold · aq1158' });
      log('TOP10 ' + item.id + ' · ' + item.title);
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        const rebuilt = await rebuildAqTop10Entry(item.id, item.title, existing.answer, {
          dsChat,
          onProgress: opts => writeProgress({ stage: 'top10 · ' + (opts.label || item.id) }),
        });
        const body = rebuilt.body;
        await saveAqTop10Entry(store, idx, item.id, item.title, body, existing);
        const check = await spotCheckEntry(item.id, body, item.title);
        const gold = rebuilt.gold || auditTop10GoldTemplate(body, item.title);
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
      if (fs.existsSync(STOP)) break;
      guardBatchOrQaBlob('batch-progress');
      writeProgress({ running: true, currentId: item.id, currentTitle: item.title, stage: 'Q&A gold · q11133' });
      log('QA ' + item.id + ' · ' + item.title);
      try {
        const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
        const sibRows = (idx.entries || []).filter(e => e && /^aq/i.test(e.id) && e.id !== item.id).slice(0, 8);
        const siblings = sibRows.map(e => ({ id: e.id, title: e.question || e.id }));
        const rebuilt = await rebuildAqQaEntry(item.id, item.title, existing.answer, {
          store,
          entryMeta: existing,
          siblings,
          valid: validIds,
          dsChat,
          onProgress: opts => writeProgress({ stage: 'qa · ' + (opts.label || item.id) }),
        });
        const saved = await saveAqQaEntry(store, idx, item.id, item.title, rebuilt.body, existing);
        const gold = auditQaGoldTemplate(rebuilt.body, item.title, item.id);
        if (saved.grade < 13 || !gold.compliant) {
          throw new Error('Not 13/13: grade=' + saved.grade + ' gold=' + (gold.compliant ? 'ok' : (gold.issues || []).join(',')));
        }
        state.qaDone = state.qaDone || [];
        state.qaDone.push(item.id);
        const sample = {
          at: new Date().toISOString(),
          phase: 'qa',
          template: 'q11133',
          id: item.id,
          title: item.title,
          url: entryUrl(item.id),
          grade: saved.grade,
          imgs: saved.imgs,
          words: rebuilt.words,
          goldOk: gold.compliant,
          pass: gold.compliant && saved.grade >= 12,
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
        log('OK ' + item.id + ' grade=' + saved.grade + ' imgs=' + saved.imgs + ' words=' + rebuilt.words + ' · ' + (rebuilt.learnLogLine || learnLogLine()));
        await maybeNotify1313(item, rebuilt.body, 'qa', saved.grade, {
          wordCount: rebuilt.words,
          imageCount: saved.imgs,
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
