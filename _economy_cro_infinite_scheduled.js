// Local 3-min CRO economy loop (same as Netlify cron). IndexNow + SEO each post.
// Usage: node _economy_cro_infinite_scheduled.js
// Stop: set cancelled in _economy_cro_infinite_state.json or Ctrl+C
const fs = require('fs');
const path = require('path');
const {
  fetchLibrary,
  checkAgainst,
  toQuestion,
  tagsFor,
  postOne,
  sleep,
  indexOne,
} = require('./_economy_post_lib');
const { generateTopics, topicKey } = require('./netlify/functions/lib/economy-cro-topics');

const STATE = path.join(__dirname, '_economy_cro_infinite_state.json');
const LOG = path.join(__dirname, '_economy_cro_infinite_run.log');
const INTERVAL_SEC = 180;
const REFILL_AT = 40;
const REFILL_COUNT = 120;
const START_ID = 10639;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n', 'utf8');
}

function loadState() {
  if (fs.existsSync(STATE)) return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  return {
    nextId: START_ID,
    queue: [],
    cursor: 0,
    posted: 0,
    skippedDup: 0,
    ids: [],
    cancelled: false,
  };
}

function saveState(s) {
  fs.writeFileSync(STATE, JSON.stringify(s, null, 2), 'utf8');
}

function refillQueue(state, libraryEntries) {
  const seen = new Set();
  for (const e of libraryEntries) {
    if (e.question) seen.add(topicKey(e.question));
  }
  for (let i = state.cursor; i < (state.queue || []).length; i++) {
    seen.add(topicKey(toQuestion(state.queue[i])));
  }
  const fresh = generateTopics(REFILL_COUNT, seen, (state.posted || 0) + (state.skippedDup || 0));
  state.queue = (state.queue || []).concat(fresh);
  return fresh.length;
}

async function seoSpotCheck(id) {
  const https = require('https');
  const url = `https://pulserevops.com/knowledge/${id}`;
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-cro-economy-local/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          const ok =
            res.statusCode === 200 &&
            /<title[^>]*>/i.test(body) &&
            /<meta\s+name="description"/i.test(body) &&
            body.includes(`rel="canonical" href="${url}"`) &&
            /application\/ld\+json/i.test(body);
          resolve({ id, status: res.statusCode, seoOk: ok });
        });
      })
      .on('error', () => resolve({ id, status: 0, seoOk: false }));
  });
}

async function tick(state, library) {
  if ((state.queue || []).length - state.cursor < REFILL_AT) {
    const n = refillQueue(state, library);
    log(`Refilled ${n} topics (queue ${state.queue.length}, cursor ${state.cursor})`);
  }

  for (let attempt = 0; attempt < 25; attempt++) {
    if (state.cursor >= state.queue.length) refillQueue(state, library);
    const topic = state.queue[state.cursor++];
    const question = toQuestion(topic);
    const dup = checkAgainst(library, question);
    if (!dup.clear) {
      state.skippedDup = (state.skippedDup || 0) + 1;
      log(`SKIP_DUP ${question.slice(0, 55)}… -> ${(dup.exact[0] || dup.similar[0])?.id}`);
      saveState(state);
      continue;
    }

    const tags = tagsFor(question, topic);
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
      log(`FAIL HTTP ${r.status} ${String(r.body || '').slice(0, 80)}`);
      return false;
    }

    state.nextId = num + 1;
    state.posted = (state.posted || 0) + 1;
    state.ids = (state.ids || []).concat(r.id);
    library.push({ id: r.id, question });
    log(`OK ${r.id} ${r.chars}ch ${question.slice(0, 65)}…`);

    await sleep(2000);
    const idx = await indexOne(r.id);
    log(`IndexNow ${r.id} HTTP ${idx.status}`);
    const seo = await seoSpotCheck(r.id);
    log(`SEO ${r.id} ${seo.seoOk ? 'OK' : 'CHECK'} HTTP ${seo.status}`);
    saveState(state);
    return true;
  }
  log('No unique topic this tick after 25 skips');
  return false;
}

async function main() {
  const state = loadState();
  if (state.cancelled) {
    log('Cancelled — set cancelled:false to resume');
    return;
  }
  state.cancelled = false;
  log(`START every ${INTERVAL_SEC}s nextId=q${state.nextId}`);

  let library = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));

  while (!state.cancelled) {
    await tick(state, library);
    saveState(state);
    log(`Sleep ${INTERVAL_SEC}s…`);
    await sleep(INTERVAL_SEC * 1000);
    if (fs.existsSync(STATE)) {
      const disk = JSON.parse(fs.readFileSync(STATE, 'utf8'));
      if (disk.cancelled) {
        state.cancelled = true;
        log('Cancelled via state file');
        break;
      }
    }
  }
}

main().catch((e) => {
  log('ERROR ' + e.message);
  process.exit(1);
});
