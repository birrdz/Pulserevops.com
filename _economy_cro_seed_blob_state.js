// Seed blob state for fringe RevOps economy tick (run once after deploy).
// Requires BLOBS_PAT in .env.local
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { generateTopics, topicKey } = require('./netlify/functions/lib/economy-cro-topics');
const { fetchLibrary } = require('./_economy_q_dedupe_check');
const { toQuestion } = require('./_economy_post_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';

function loadPat() {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = env.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing in .env.local');
  return m[1].trim();
}

async function main() {
  const pat = loadPat();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: pat });
  const existing = await store.get(STATE_KEY, { type: 'json' });
  if (existing && existing.posted > 0) {
    console.log('Blob state already exists — posted', existing.posted, 'nextId', existing.nextId);
    return;
  }

  const entries = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));
  const seen = new Set();
  for (const e of entries) {
    if (e.question) seen.add(topicKey(e.question));
  }
  const queue = generateTopics(200, seen, 0);

  const state = {
    nextId: 10639,
    queue,
    cursor: 0,
    posted: 0,
    skippedDup: 0,
    ids: [],
    cancelled: false,
    topicGen: 'fringe-v1',
    started_ms: Date.now(),
    seeded: new Date().toISOString(),
  };
  await store.setJSON(STATE_KEY, state);
  console.log('Seeded', queue.length, 'topics, nextId q10639');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
