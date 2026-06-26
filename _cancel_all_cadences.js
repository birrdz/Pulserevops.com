#!/usr/bin/env node
/** Set economy blob cancelled=true. Requires BLOBS_PAT in .env.local */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_KEY = '_economy_cro_infinite_state.json';

function loadPat() {
  const raw = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = raw.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing');
  return m[1].trim();
}

async function main() {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: loadPat() });
  const state = (await store.get(STATE_KEY, { type: 'json' })) || {};
  state.cancelled = true;
  state.cancelledAt = new Date().toISOString();
  state.cancelReason = 'owner: stop all cadences';
  await store.setJSON(STATE_KEY, state);
  console.log('Economy tick cancelled in blob', STATE_KEY);
}

main().catch((e) => { console.error(e); process.exit(1); });
