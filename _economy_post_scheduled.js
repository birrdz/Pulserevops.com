// Post economy Q&As from a queue in batches (no LLM). Background-safe.
// Usage: node _economy_post_scheduled.js [queueFile] [batchSize] [intervalSec] [maxPosts] [startId]
// IndexNow + SEO spot-check after each batch (publish rule).
const fs = require('fs');
const path = require('path');
const https = require('https');
const {
  fetchLibrary,
  checkAgainst,
  toQuestion,
  tagsFor,
  postOne,
  sleep,
  indexOne,
} = require('./_economy_post_lib');

const QUEUE = path.resolve(process.argv[2] || path.join(__dirname, '_economy_palantir100_queue.txt'));
const BATCH = parseInt(process.argv[3] || '5', 10);
const INTERVAL_SEC = parseInt(process.argv[4] || '600', 10);
const MAX_POSTS = parseInt(process.argv[5] || '100', 10);
const START_ID_DEFAULT = parseInt(process.argv[6] || '10539', 10);
const queueStem = path.basename(QUEUE).replace(/\.txt$/i, '');
const STATE = path.join(__dirname, `${queueStem.replace(/_queue$/, '_state')}.json`);
const LOG = path.join(__dirname, `${queueStem.replace(/_queue$/, '_run')}.log`);

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n', 'utf8');
}

function loadState() {
  if (fs.existsSync(STATE)) return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  return { nextId: START_ID_DEFAULT, posted: 0, ids: [], done: false };
}

function saveState(s) {
  fs.writeFileSync(STATE, JSON.stringify(s, null, 2), 'utf8');
}

function readLines() {
  return fs.readFileSync(QUEUE, 'utf8').split(/\r?\n/);
}

function writeLines(lines) {
  fs.writeFileSync(QUEUE, lines.join('\n'), 'utf8');
}

function pendingIndices(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('DONE|') || line.startsWith('SKIP_DUP|')) continue;
    out.push(i);
  }
  return out;
}

async function postTopic(topic, lines, idx, state, qEntries) {
  const question = toQuestion(topic);
  const tags = tagsFor(question, topic);
  const dup = checkAgainst(qEntries, question);
  if (!dup.clear) {
    const hit = dup.exact[0] || dup.similar[0];
    lines[idx] = 'SKIP_DUP|' + question;
    writeLines(lines);
    log(`SKIP_DUP ${question.slice(0, 60)}… -> ${hit?.id}`);
    return null;
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

  if (r.status !== 200 && r.status !== 201) {
    log(`FAIL ${r.id} HTTP ${r.status} ${(r.body || '').slice(0, 80)}`);
    return null;
  }

  state.nextId = num + 1;
  state.posted++;
  state.ids.push(r.id);
  lines[idx] = 'DONE|' + question;
  writeLines(lines);
  qEntries.push({ id: r.id, question });
  log(`OK ${r.id} ${question.slice(0, 70)}…`);
  await sleep(2500);
  return r.id;
}

function httpGet(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-economy-scheduled/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

async function seoSpotCheck(id) {
  const url = `https://pulserevops.com/knowledge/${id}`;
  const page = await httpGet(url);
  const canonical = `rel="canonical" href="${url}"`;
  const ok =
    page.status === 200 &&
    /<title[^>]*>/i.test(page.body) &&
    /<meta\s+name="description"/i.test(page.body) &&
    page.body.includes(canonical) &&
    /application\/ld\+json/i.test(page.body);
  log(`SEO ${id} HTTP ${page.status} ${ok ? 'OK' : 'CHECK'}`);
  return ok;
}

async function indexPosted(ids) {
  if (!ids.length) return;
  log(`IndexNow pass for ${ids.length} IDs…`);
  for (const id of ids) {
    const r = await indexOne(id);
    log(`IndexNow ${id} ${r.status}`);
    await sleep(900);
  }
}

async function main() {
  if (!fs.existsSync(QUEUE)) {
    console.error('Queue missing:', QUEUE);
    process.exit(1);
  }

  const state = loadState();
  if (state.done && !state.cancelled) {
    log('Already marked done. Delete state file to rerun.');
    return;
  }
  if (state.cancelled) {
    state.done = false;
    state.cancelled = false;
    delete state.cancelledAt;
    delete state.cancelReason;
  }

  log(`START batch=${BATCH} interval=${INTERVAL_SEC}s max=${MAX_POSTS} nextId=q${state.nextId}`);

  let qEntries = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));
  const sessionIds = [];

  while (state.posted < MAX_POSTS) {
    const lines = readLines();
    const pending = pendingIndices(lines);
    if (!pending.length) {
      log('Queue empty.');
      break;
    }

    const batchCount = Math.min(BATCH, MAX_POSTS - state.posted, pending.length);
    log(`Batch of ${batchCount} (${state.posted}/${MAX_POSTS} posted)`);

    const batchIds = [];
    for (let b = 0; b < batchCount; b++) {
      const idx = pending[b];
      const topic = lines[idx].trim();
      const id = await postTopic(topic, lines, idx, state, qEntries);
      saveState(state);
      if (id) {
        batchIds.push(id);
        sessionIds.push(id);
      }
      if (state.posted >= MAX_POSTS) break;
    }

    if (batchIds.length) {
      await seoSpotCheck(batchIds[0]);
      await indexPosted(batchIds);
      state.indexedIds = [...(state.indexedIds || []), ...batchIds];
      saveState(state);
    }

    saveState(state);
    if (state.posted >= MAX_POSTS) break;

    const lines2 = readLines();
    if (!pendingIndices(lines2).length) break;

    log(`Sleep ${INTERVAL_SEC}s until next batch…`);
    await sleep(INTERVAL_SEC * 1000);
  }

  state.done = true;
  saveState(state);
  log(`DONE posted=${state.posted} range q${state.ids[0] || '?'}–q${state.ids[state.ids.length - 1] || '?'}`);

  const already = new Set(state.indexedIds || []);
  const remaining = (state.ids || []).filter((id) => !already.has(id));
  if (remaining.length) await indexPosted(remaining);

  // Bump _economy_post_one.js START_ID comment via log only
  log(`Set START_ID to ${state.nextId} in _economy_post_one.js when finished.`);
}

main().catch((e) => {
  log(`ERROR ${e.message}`);
  process.exit(1);
});
