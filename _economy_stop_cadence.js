#!/usr/bin/env node
/** Stop the Netlify economy tick from posting new Q&As (blob state cancelled). */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';

function loadPat() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local missing');
  const m = fs.readFileSync(envPath, 'utf8').match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing');
  return m[1].trim();
}

async function main() {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: loadPat() });
  const state = (await store.get(STATE_KEY, { type: 'json' })) || {};
  state.cancelled = true;
  state.cancelledAt = new Date().toISOString();
  state.cancelReason = 'owner-stop-new-qa-polish-only';
  await store.setJSON(STATE_KEY, state);
  console.log(JSON.stringify({ ok: true, cancelled: true, nextId: state.nextId, posted: state.posted }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
