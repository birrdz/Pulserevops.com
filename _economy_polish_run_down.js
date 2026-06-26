#!/usr/bin/env node
/**
 * Polish newest → older via Netlify Gemini (background function).
 *   node _economy_polish_run_down.js --count=1500
 *   node _economy_polish_run_down.js --count=10 --start=q11129
 */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { loadEnvLocal } = require('./netlify/functions/lib/load-env-local');
const { needsIntelligentRewrite } = require('./netlify/functions/lib/economy-answer-build');

const SITE = 'https://pulserevops.com';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = path.join(__dirname, '_economy_polish_run_down.log');
const STATE = path.join(__dirname, '_economy_polish_run_down_state.json');
const POLL_MS = 8000;
const MAX_WAIT_MS = 180000;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

function parseArgs() {
  const countArg = process.argv.find((a) => a.startsWith('--count='));
  const startArg = process.argv.find((a) => a.startsWith('--start='));
  return {
    count: countArg ? parseInt(countArg.split('=')[1], 10) : 1500,
    startId: startArg ? startArg.split('=')[1].trim() : null,
    skipDone: !process.argv.includes('--force'),
  };
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    return { done: {}, failed: {}, cursor: null };
  }
}

function saveState(s) {
  fs.writeFileSync(STATE, JSON.stringify(s, null, 2), 'utf8');
}

async function startPolish(id) {
  const url = `${SITE}/.netlify/functions/pulse-economy-polish?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function waitForDone(store, id, startedAt) {
  while (Date.now() - startedAt < MAX_WAIT_MS) {
    await new Promise((r) => setTimeout(r, POLL_MS));
    const blob = await store.get('answers/' + id + '.json', { type: 'json' });
    const lab = blob?.lab_run || '';
    const src = blob?.source || '';
    if (/^economy-llm/.test(lab) || (src && String(src).startsWith('llm-'))) {
      return { ok: true, blob };
    }
    const act = await store.get('_current_activity.json', { type: 'json' });
    if (act?.target === id && act?.action === 'idle') {
      return { ok: false, reason: 'idle_without_llm', blob };
    }
    if (act?.target !== id && act?.action !== 'polishing') {
      const fin = blob && !needsIntelligentRewrite(blob);
      if (fin) return { ok: true, blob, note: 'already_ok' };
    }
  }
  return { ok: false, reason: 'timeout' };
}

async function clearStaleInFlight(store) {
  await store.setJSON('_in_flight.json', { ids: [], workers: [], ts: Date.now() });
  await store.setJSON('_current_activity.json', { action: 'idle', target: null, score: null, ts: Date.now() });
}

async function main() {
  const opts = parseArgs();
  loadEnvLocal(__dirname);
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const state = loadState();

  let rows = (idx.entries || [])
    .filter((e) => e && /^q\d+$/i.test(e.id))
    .sort((a, b) => parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10));

  if (opts.startId) {
    const n = parseInt(opts.startId.replace(/^q/i, ''), 10);
    rows = rows.filter((e) => parseInt(e.id.slice(1), 10) <= n);
  }

  rows = rows.slice(0, opts.count);
  log(`QUEUE ${rows.length} ids (newest first) count=${opts.count}`);

  await clearStaleInFlight(store);

  let done = 0;
  let skip = 0;
  let fail = 0;

  for (const row of rows) {
    const id = row.id;
    if (opts.skipDone && state.done[id]) {
      skip++;
      continue;
    }

    const blob = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!blob?.question) {
      log(`SKIP ${id} no blob`);
      skip++;
      continue;
    }
    if (opts.skipDone && !needsIntelligentRewrite(blob)) {
      log(`SKIP ${id} already llm ok`);
      state.done[id] = { ts: Date.now(), note: 'already_ok' };
      saveState(state);
      skip++;
      continue;
    }

    log(`START ${id} (${done + 1}/${rows.length - skip}) ${blob.question.slice(0, 60)}…`);
    const t0 = Date.now();
    const start = await startPolish(id);
    log(`START ${id} http=${start.status} ${JSON.stringify(start.body).slice(0, 200)}`);

    if (start.status === 200 && start.body?.ok) {
      state.done[id] = { ts: Date.now(), source: start.body.source };
      saveState(state);
      done++;
      log(`DONE ${id} sync words=${start.body.words} source=${start.body.source}`);
      continue;
    }

    if (start.status !== 202 && !start.body?.started) {
      fail++;
      log(`FAIL ${id} start ${start.status}`);
      state.failed[id] = { ts: Date.now(), start: start.body };
      saveState(state);
      continue;
    }

    const wait = await waitForDone(store, id, t0);
    if (wait.ok) {
      done++;
      state.done[id] = { ts: Date.now(), lab_run: wait.blob?.lab_run, source: wait.blob?.source };
      log(`DONE ${id} lab_run=${wait.blob?.lab_run} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    } else {
      fail++;
      state.failed[id] = { ts: Date.now(), reason: wait.reason };
      log(`FAIL ${id} ${wait.reason} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
      await clearStaleInFlight(store);
    }
    saveState(state);
    await new Promise((r) => setTimeout(r, 2000));
  }

  await clearStaleInFlight(store);
  log(`FINISH done=${done} skip=${skip} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
