// Flush fringe backlog in blob queue; reseed palantir-v1 only.
// Usage: node _economy_cro_flush_palantir_queue.js
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { generateTopicsBatch, topicKey } = require('./netlify/functions/lib/economy-cro-topics');
const { fetchLibrary } = require('./_economy_q_dedupe_check');
const { toQuestion } = require('./_economy_post_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';
const QUEUE_SIZE = 200;

function loadPat() {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = env.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing in .env.local');
  return m[1].trim();
}

async function main() {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: loadPat() });
  const state = (await store.get(STATE_KEY, { type: 'json' })) || {};
  const entries = await fetchLibrary();
  const seen = new Set();
  for (const e of entries) {
    if (e.question) seen.add(topicKey(e.question));
  }

  const seed = (state.posted || 0) + (state.skippedDup || 0);
  const batch = generateTopicsBatch(QUEUE_SIZE, seen, seed, 'palantir-v1');
  if (!batch.lines.length) {
    throw new Error('No unique palantir topics generated');
  }

  const palantirCount = batch.lines.filter((t) => /palantir/i.test(t)).length;
  const prevRemaining = (state.queue || []).length - (state.cursor || 0);

  state.queue = batch.lines;
  state.cursor = 0;
  state.topicGen = 'phased-revops-v2';
  state.topicPhase = 'palantir-v1';
  state.queueFlushedAt = Date.now();
  state.queueFlushNote = 'owner flush: palantir-v1 only';

  await store.setJSON(STATE_KEY, state);

  console.log(
    JSON.stringify(
      {
        ok: true,
        flushedOldRemaining: prevRemaining,
        newQueueLength: state.queue.length,
        palantirLines: palantirCount,
        topicPhase: state.topicPhase,
        nextId: state.nextId,
        posted: state.posted,
        firstTopic: toQuestion(state.queue[0]).slice(0, 120),
        secondTopic: state.queue[1] ? toQuestion(state.queue[1]).slice(0, 120) : null,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
