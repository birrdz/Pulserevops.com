#!/usr/bin/env node
/** Resume 3-min NIL economy cadence (uncancel blob state). Requires BLOBS_PAT in .env.local */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';
const TOPIC_GEN = 'nil-d1-2027-v1';

function loadPat() {
  const raw = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = raw.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing');
  return m[1].trim();
}

async function main() {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: loadPat() });
  const state = (await store.get(STATE_KEY, { type: 'json' })) || {};
  state.cancelled = false;
  delete state.cancelledAt;
  delete state.cancelReason;
  state.resumedAt = new Date().toISOString();
  state.topicGen = state.topicGen || TOPIC_GEN;
  state.topicPhase = state.topicPhase || 'fbs-nil-2027';
  state.qualityGate = 'economy-cadence-v3-min-1000w';
  await store.setJSON(STATE_KEY, state);
  console.log('Resumed economy cadence:', {
    cancelled: state.cancelled,
    topicGen: state.topicGen,
    topicPhase: state.topicPhase,
    nextId: state.nextId,
    cursor: state.cursor,
    queueRemaining: (state.queue?.length || 0) - (state.cursor || 0),
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
