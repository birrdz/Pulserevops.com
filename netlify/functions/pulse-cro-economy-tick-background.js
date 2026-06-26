// pulse-cro-economy-tick — every 2 min: one economy Q&A (1,000+ words, valid Mermaid) + optional st####.
// Topics: RevOps Google-top → long-tail (economy-revops-google-topics). LLM + programmatic fallback.
// Quality gate in economy-cro-publish postOne. Dedupe, IndexNow + SEO spot-check.

const { getStore } = require('@netlify/blobs');
const { fetchLibrary, checkAgainst } = require('./lib/economy-dedupe');
const {
  generateTopicsBatch,
  topicKey,
  isLegacyCroHireTopic,
  nextPhaseId,
  classifyTopicPhase,
  PHASES,
  BATCH_SIZES,
} = require('./lib/economy-revops-google-topics');

const TOPIC_GEN = 'revops-google-v1';
const DEFAULT_PHASE = 'google-top-v1';
const { toQuestion, tagsFor, postOne, seoSpotCheck } = require('./lib/economy-cro-publish');
const {
  fetchLibraryAll,
  maxStNum,
  postTrainingFromTopic,
} = require('./lib/economy-st-publish');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';
const HEARTBEAT_KEY = '_economy_cro_infinite_heartbeat.json';
const DEFAULT_NEXT_ID = 10824;
const REFILL_AT = 40;
const REFILL_COUNT = 120;
const MAX_SKIP_PER_TICK = 25;

function getStoreSafe() {
  const tok = process.env.BLOBS_PAT;
  try {
    return getStore('pulse-machine-library');
  } catch {
    return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  }
}

function defaultState() {
  return {
    nextId: DEFAULT_NEXT_ID,
    queue: [],
    cursor: 0,
    posted: 0,
    skippedDup: 0,
    ids: [],
    cancelled: false,
    started_ms: Date.now(),
    topicGen: TOPIC_GEN,
    topicPhase: DEFAULT_PHASE,
    batchIndex: 1,
    nextStId: null,
    postedSt: 0,
    stIds: [],
  };
}

function currentBatchIndex(state) {
  const posted = state.posted || 0;
  let cum = 0;
  for (let i = 0; i < BATCH_SIZES.length; i++) {
    cum += BATCH_SIZES[i];
    if (posted < cum) return i + 1;
  }
  const tail = BATCH_SIZES[BATCH_SIZES.length - 1] || 200;
  return BATCH_SIZES.length + Math.floor((posted - cum) / tail) + 1;
}

async function writeHeartbeat(store, payload) {
  try {
    await store.setJSON(HEARTBEAT_KEY, Object.assign({ ts: Date.now() }, payload));
  } catch (_) {}
}

async function refillQueue(state, libraryEntries) {
  const seen = new Set();
  for (const e of libraryEntries) {
    if (e.question) seen.add(topicKey(e.question));
  }
  for (let i = state.cursor; i < state.queue.length; i++) {
    seen.add(topicKey(toQuestion(state.queue[i])));
  }
  const seed = state.posted + state.skippedDup;
  const batchIndex = currentBatchIndex(state);
  state.batchIndex = batchIndex;
  const batch = generateTopicsBatch(
    REFILL_COUNT,
    seen,
    seed,
    state.topicPhase || DEFAULT_PHASE,
    batchIndex
  );
  state.queue = state.queue.concat(batch.lines);
  state.topicPhase = batch.phaseUsed || state.topicPhase || DEFAULT_PHASE;
  if (batch.lines.length === 0) {
    state.topicPhase = nextPhaseId(state.topicPhase);
  }
  return batch.lines.length;
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async function croEconomyTick() {
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}

  const startMs = Date.now();
  const store = getStoreSafe();

  let state;
  try {
    state = (await store.get(STATE_KEY, { type: 'json' })) || defaultState();
  } catch (err) {
    await writeHeartbeat(store, { ok: false, reason: 'state_read_error', error: String(err) });
    return { statusCode: 200, body: 'state read error: ' + err.message };
  }

  if (state.cancelled) {
    await writeHeartbeat(store, { ok: true, reason: 'cancelled', posted: state.posted });
    return { statusCode: 200, body: 'revops google economy tick cancelled by owner' };
  }

  if (state.topicGen !== TOPIC_GEN) {
    state.queue = [];
    state.cursor = 0;
    state.topicGen = TOPIC_GEN;
    state.topicPhase = DEFAULT_PHASE;
    state.batchIndex = 1;
    state.queueMigratedAt = Date.now();
    state.pivotNote = 'RevOps Google-top economy; 2min Netlify cron';
  }

  const library = await fetchLibrary();
  const libraryAll = await fetchLibraryAll();
  if (!state.nextStId) state.nextStId = maxStNum(libraryAll) + 1;
  const remaining = state.queue.length - state.cursor;
  if (remaining < REFILL_AT) {
    const added = await refillQueue(state, library);
    state.lastRefill = { ts: Date.now(), added, queueLength: state.queue.length, batchIndex: state.batchIndex };
  }

  let postedId = null;
  let postedTopic = null;
  let lastSkip = null;
  let attempts = 0;

  while (!postedId && attempts < MAX_SKIP_PER_TICK) {
    attempts++;
    if (state.cursor >= state.queue.length) {
      await refillQueue(state, library);
      if (state.cursor >= state.queue.length) {
        await store.setJSON(STATE_KEY, state);
        state.topicPhase = nextPhaseId(state.topicPhase || DEFAULT_PHASE);
        await writeHeartbeat(store, {
          ok: false,
          reason: 'queue_exhausted',
          posted: state.posted,
          topicPhase: state.topicPhase,
          batchIndex: state.batchIndex,
        });
        return { statusCode: 200, body: 'could not generate new unique topics' };
      }
    }

    const topic = state.queue[state.cursor];
    state.cursor++;
    if (isLegacyCroHireTopic(topic)) {
      state.skippedLegacyCro = (state.skippedLegacyCro || 0) + 1;
      continue;
    }
    const question = toQuestion(topic);
    const tags = tagsFor(question, topic);
    const dup = checkAgainst(library, question);

    if (!dup.clear) {
      state.skippedDup = (state.skippedDup || 0) + 1;
      lastSkip = {
        question: question.slice(0, 80),
        hit: dup.exact[0] || dup.similar[0],
      };
      continue;
    }

    let num = state.nextId;
    let r;
    for (let tries = 0; tries < 200; tries++) {
      r = await postOne(num, question, tags);
      if (r.status === 200 || r.status === 201) break;
      if (r.status === 409) {
        num++;
        continue;
      }
      break;
    }

    if (r.status === 422) {
      state.skippedQuality = (state.skippedQuality || 0) + 1;
      lastSkip = { question: question.slice(0, 80), hit: 'quality_gate', body: String(r.body || '').slice(0, 120) };
      continue;
    }

    if (r.status !== 200 && r.status !== 201) {
      state.lastError = { ts: Date.now(), status: r.status, body: String(r.body || '').slice(0, 200) };
      await store.setJSON(STATE_KEY, state);
      await writeHeartbeat(store, { ok: false, reason: 'post_failed', status: r.status });
      return { statusCode: 200, body: 'post failed HTTP ' + r.status };
    }

    state.nextId = num + 1;
    state.posted = (state.posted || 0) + 1;
    state.topicPhase = classifyTopicPhase(topic);
    state.batchIndex = currentBatchIndex(state);
    state.lastId = r.id;
    state.lastQuestion = question;
    state.ids = (state.ids || []).concat(r.id).slice(-500);
    library.push({ id: r.id, question });
    libraryAll.push({ id: r.id, question });
    postedId = r.id;
    postedTopic = topic;
    let indexMeta = null;
    try {
      indexMeta = JSON.parse(r.body || '{}').index;
    } catch (_) {}
    state.lastIndex = indexMeta;

    await new Promise((res) => setTimeout(res, 800));
    const seo = await seoSpotCheck(r.id);
    state.lastSeo = seo;
  }

  let stResult = null;
  if (postedId && postedTopic) {
    let stNum = state.nextStId;
    for (let stTry = 0; stTry < 5 && !stResult?.ok; stTry++) {
      stResult = await postTrainingFromTopic(stNum, postedTopic, libraryAll);
      if (stResult.ok) {
        state.nextStId = stNum + 1;
        state.postedSt = (state.postedSt || 0) + 1;
        state.lastStId = stResult.id;
        state.lastStQuestion = stResult.question;
        state.stIds = (state.stIds || []).concat(stResult.id).slice(-500);
        state.lastStIndex = stResult.index;
        state.lastStSeo = stResult.seo;
        libraryAll.push({ id: stResult.id, question: stResult.question });
        break;
      }
      if (stResult.skipped || stResult.reason === 'duplicate') {
        state.skippedStDup = (state.skippedStDup || 0) + 1;
        break;
      }
      if (stResult.reason === 'id_exhausted' || stResult.status === 409) stNum++;
      else break;
    }
    state.lastStAttempt = stResult;
  }

  state.lastTickMs = Date.now();
  state.elapsed_ms = Date.now() - startMs;
  await store.setJSON(STATE_KEY, state);
  await writeHeartbeat(store, {
    ok: !!postedId,
    id: postedId,
    stId: state.lastStId || null,
    stOk: !!(stResult && stResult.ok),
    skipped: lastSkip,
    posted: state.posted,
    postedSt: state.postedSt,
    nextId: state.nextId,
    nextStId: state.nextStId,
    queueRemaining: state.queue.length - state.cursor,
    topicGen: state.topicGen,
    topicPhase: state.topicPhase,
    batchIndex: state.batchIndex,
    topicPhaseOrder: PHASES.map((p) => p.id),
    index: state.lastIndex,
    seo: state.lastSeo,
    stIndex: state.lastStIndex,
    stSeo: state.lastStSeo,
    elapsed_ms: state.elapsed_ms,
  });

  const summary = postedId
    ? 'posted ' +
      postedId +
      (state.lastStId ? ' + ' + state.lastStId : '') +
      ' batch=' +
      state.batchIndex +
      ' seo=' +
      (state.lastSeo && state.lastSeo.seoOk) +
      ' stSeo=' +
      (state.lastStSeo && state.lastStSeo.seoOk) +
      ' indexed=' +
      (state.lastIndex && state.lastIndex.ok)
    : 'no post after ' + attempts + ' skips' + (lastSkip && lastSkip.hit ? ' hit=' + lastSkip.hit.id : '');
  return { statusCode: 200, body: summary };
};
