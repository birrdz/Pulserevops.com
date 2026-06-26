#!/usr/bin/env node
const { getStore } = require('@netlify/blobs');
const { loadEnvLocal } = require('./netlify/functions/lib/load-env-local');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

async function main() {
  loadEnvLocal(process.cwd());
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  const ts = Date.now();
  await store.setJSON('_in_flight.json', { ids: [], workers: [], ts });
  await store.setJSON('_current_activity.json', { action: 'idle', target: null, score: null, ts });
  console.log(JSON.stringify({ ok: true, cleared: true, ts }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
