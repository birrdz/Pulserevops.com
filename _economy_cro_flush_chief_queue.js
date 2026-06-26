// Flush economy queue → next 100+ CHIEF (women's executive network) RevOps Q&As.
// Usage: node _economy_cro_flush_chief_queue.js
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { generateTopicsBatch, topicKey } = require('./netlify/functions/lib/economy-cro-topics');
const { fetchLibrary } = require('./_economy_q_dedupe_check');
const { toQuestion } = require('./_economy_post_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';
const QUEUE_SIZE = 120;

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
  const batch = generateTopicsBatch(QUEUE_SIZE, seen, seed, 'chief-v1');
  if (!batch.lines.length) {
    throw new Error('No unique CHIEF topics generated');
  }

  const chiefCount = batch.lines.filter((t) => /\bCHIEF\b/.test(t)).length;
  const prevRemaining = (state.queue || []).length - (state.cursor || 0);

  state.queue = batch.lines;
  state.cursor = 0;
  state.topicGen = 'phased-revops-v2';
  state.topicPhase = 'chief-v1';
  state.queueFlushedAt = Date.now();
  state.queueFlushNote = 'owner flush: chief-v1 — CHIEF women networking (100+ queue)';

  await store.setJSON(STATE_KEY, state);

  console.log(
    JSON.stringify(
      {
        ok: true,
        flushedOldRemaining: prevRemaining,
        newQueueLength: state.queue.length,
        chiefLines: chiefCount,
        topicPhase: state.topicPhase,
        nextId: state.nextId,
        posted: state.posted,
        firstTopic: toQuestion(state.queue[0]).slice(0, 130),
        secondTopic: state.queue[1] ? toQuestion(state.queue[1]).slice(0, 130) : null,
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
