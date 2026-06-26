// Seed blob _economy_cro_infinite_state.json for RevOps Google-top economy cron.
// Usage: node _economy_revops_google_seed.js [--force]
// Requires BLOBS_PAT in .env.local
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const {
  buildGoogleTop100,
  topicKey,
  toQuestion,
} = require('./netlify/functions/lib/economy-revops-google-topics');
const { fetchLibrary } = require('./_economy_q_dedupe_check');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';

function loadPat() {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = env.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing in .env.local');
  return m[1].trim();
}

function maxQId(entries) {
  let max = 10823;
  for (const e of entries) {
    const m = String(e.id || '').match(/^q(\d+)$/i);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max;
}

async function main() {
  const force = process.argv.includes('--force');
  const pat = loadPat();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: pat });
  const existing = await store.get(STATE_KEY, { type: 'json' });
  if (existing && existing.posted > 0 && !force) {
    console.log('Blob state exists — posted', existing.posted, 'nextId', existing.nextId, '(use --force to reset)');
    return;
  }

  const entries = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));
  const seen = new Set();
  for (const e of entries) {
    if (e.question) seen.add(topicKey(e.question));
  }
  const queue = buildGoogleTop100().filter((line) => !seen.has(topicKey(toQuestion(line))));
  const nextId = maxQId(entries) + 1;

  const state = {
    nextId,
    queue,
    cursor: 0,
    posted: existing && existing.posted ? existing.posted : 0,
    skippedDup: 0,
    ids: (existing && existing.ids) || [],
    cancelled: false,
    topicGen: 'revops-google-v1',
    topicPhase: 'google-top-v1',
    batchIndex: 1,
    started_ms: Date.now(),
    seeded: new Date().toISOString(),
    pivotNote: 'RevOps Google-top; 2min Netlify cron',
  };
  await store.setJSON(STATE_KEY, state);
  console.log('Seeded revops-google-v1 — nextId q' + nextId + ', queue', queue.length, 'topics');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
