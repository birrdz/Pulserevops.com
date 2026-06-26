// Flush economy queue → 200 data-center Q&As, broad definitions first then fringe.
// Usage: node _economy_cro_flush_datacenter_queue.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { generateOrderedDataCenterQueue, topicKey } = require('./netlify/functions/lib/economy-cro-topics');
const { fetchLibrary } = require('./_economy_q_dedupe_check');
const { toQuestion } = require('./_economy_post_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';
const QUEUE_SIZE = 200;

function loadPat() {
  const env = fs.readFileSync('.env.local', 'utf8');
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
  const batch = generateOrderedDataCenterQueue(QUEUE_SIZE, seen, seed);
  if (batch.lines.length < 80) {
    throw new Error('Only generated ' + batch.lines.length + ' unique data-center topics');
  }

  const broad = batch.lines.filter((t) => /^what is/i.test(toQuestion(t))).length;
  const prevRemaining = (state.queue || []).length - (state.cursor || 0);

  state.queue = batch.lines;
  state.cursor = 0;
  state.topicGen = 'phased-revops-v2';
  state.topicPhase = 'datacenter-v1';
  state.queueFlushedAt = Date.now();
  state.queueFlushNote = 'owner flush: datacenter-v1 — 200 broad→fringe (3-min cron)';

  await store.setJSON(STATE_KEY, state);

  console.log(
    JSON.stringify(
      {
        ok: true,
        flushedOldRemaining: prevRemaining,
        newQueueLength: state.queue.length,
        broadWhatIsCount: broad,
        topicPhase: state.topicPhase,
        nextId: state.nextId,
        posted: state.posted,
        firstTopic: toQuestion(state.queue[0]).slice(0, 140),
        topicAt100: state.queue[99] ? toQuestion(state.queue[99]).slice(0, 140) : null,
        lastTopic: toQuestion(state.queue[state.queue.length - 1]).slice(0, 140),
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
