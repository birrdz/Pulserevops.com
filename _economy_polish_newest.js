#!/usr/bin/env node
/**
 * Rewrite economy Q&As newest-first with LLM answers (1,000–1,200 words), not templates.
 * Updates _in_flight.json so /knowledge.html shows LIVE POLISH highlight on the active card.
 *
 *   node _economy_polish_newest.js              # one entry
 *   node _economy_polish_newest.js --batch=10   # up to 10
 *   node _economy_polish_newest.js --dry-run
 *   node _economy_polish_newest.js --all-need   # any economy entry needing rewrite
 *   node _economy_polish_newest.js --id=q11129  # one entry (newest-first default)
 *   node _economy_polish_newest.js --id=q11129 --remote  # Netlify Gemini (no local key)
 *
 * Local: BLOBS_PAT + GEMINI_API_KEY in .env.local. Or --remote → pulse-economy-polish on Netlify.
 */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { loadEnvLocal } = require('./netlify/functions/lib/load-env-local');
const { generateAnswer } = require('./netlify/functions/lib/economy-answer-generate');
const { needsIntelligentRewrite } = require('./netlify/functions/lib/economy-answer-build');
const { validateEconomyAnswer, countWords } = require('./netlify/functions/lib/economy-answer-quality');
const { capitalizeSentencesInMarkdown } = require('./netlify/functions/lib/text-capitalize');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = path.join(__dirname, '_economy_quality_polish.log');
const PROGRESS = path.join(__dirname, '_economy_quality_polish_progress.json');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

function parseArgs() {
  const batchArg = process.argv.find((a) => a.startsWith('--batch='));
  const idArg = process.argv.find((a) => a.startsWith('--id='));
  return {
    batch: batchArg ? parseInt(batchArg.split('=')[1], 10) : 1,
    id: idArg ? idArg.split('=')[1].trim() : null,
    remote: process.argv.includes('--remote'),
    dryRun: process.argv.includes('--dry-run'),
    allNeed: process.argv.includes('--all-need'),
    days: (() => {
      const a = process.argv.find((x) => x.startsWith('--days='));
      return a ? parseInt(a.split('=')[1], 10) : 14;
    })(),
  };
}

async function polishRemote(id, dryRun) {
  const q = new URLSearchParams({ id });
  if (dryRun) q.set('dry', '1');
  const url = 'https://pulserevops.com/.netlify/functions/pulse-economy-polish?' + q.toString();
  log(`REMOTE ${url}`);
  const res = await fetch(url, { cache: 'no-store' });
  const body = await res.json().catch(() => ({}));
  log(`REMOTE ${res.status} ${JSON.stringify(body).slice(0, 500)}`);
  if (!body.ok) process.exit(1);
}

function isEconomyEntry(e) {
  const tags = e.tags || [];
  return tags.includes('economy-mode') || tags.includes('revops-google') || tags.includes('nil-gtm');
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  } catch {
    return { done: {} };
  }
}

function saveProgress(prog) {
  fs.writeFileSync(PROGRESS, JSON.stringify(prog, null, 2), 'utf8');
}

async function setInFlight(store, id, action, score) {
  try {
    const cur = (await store.get('_in_flight.json', { type: 'json' })) || {};
    const workers = (cur.workers || []).filter((w) => w && w.id !== id);
    workers.push({ id, action, score: score || null, ts: Date.now() });
    await store.setJSON('_in_flight.json', { ids: workers.map((w) => w.id), workers, ts: Date.now() });
    await store.setJSON('_current_activity.json', { action, target: id, score: score || null, ts: Date.now() });
  } catch (_) {}
}

async function clearInFlight(store, id) {
  try {
    const cur = (await store.get('_in_flight.json', { type: 'json' })) || {};
    const workers = (cur.workers || []).filter((w) => w && w.id !== id);
    await store.setJSON('_in_flight.json', { ids: workers.map((w) => w.id), workers, ts: Date.now() });
    if (!workers.length) {
      await store.setJSON('_current_activity.json', { action: 'idle', target: id, score: null, ts: Date.now() });
    }
  } catch (_) {}
}

async function main() {
  const opts = parseArgs();
  if (opts.remote && opts.id) {
    return polishRemote(opts.id, opts.dryRun);
  }
  const env = loadEnvLocal(__dirname);
  if (!env.hasLlm && !opts.remote) log('WARN no GEMINI/GROQ key — use --remote or add GEMINI_API_KEY to .env.local');
  if (!env.hasLlm && opts.id) {
    return polishRemote(opts.id, opts.dryRun);
  }

  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  const cutoff = Date.now() - opts.days * 86400000;
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const prog = loadProgress();

  let candidates = (idx.entries || [])
    .filter((e) => e && /^q\d+$/i.test(e.id) && isEconomyEntry(e))
    .sort((a, b) => parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10));

  if (!opts.allNeed) {
    candidates = candidates.filter((e) => (e.ts || 0) >= cutoff);
  }

  if (opts.id) {
    const row = candidates.find((e) => e.id === opts.id) || (idx.entries || []).find((e) => e?.id === opts.id);
    if (!row) {
      log(`FAIL no index row for ${opts.id}`);
      process.exit(1);
    }
    candidates = [row];
  }

  const queue = [];
  for (const row of candidates) {
    if (prog.done[row.id] && !opts.allNeed) continue;
    const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!blob?.question) continue;
    if (!needsIntelligentRewrite(blob)) continue;
    queue.push({ row, blob });
    if (queue.length >= opts.batch * 3) break;
  }

  log(`START batch=${opts.batch} dryRun=${opts.dryRun} candidates=${queue.length} hasLlm=${env.hasLlm}`);

  let done = 0;
  let fail = 0;

  for (const { row, blob } of queue) {
    if (done >= opts.batch) break;

    await setInFlight(store, row.id, 'polishing', blob.quality_score || 5);
    log(`POLISH ${row.id} Q=${blob.question.slice(0, 70)}…`);

    let answer;
    let source;
    try {
      ({ answer, source } = await generateAnswer(blob.question, { preferLlm: true, llmRequired: true }));
    } catch (err) {
      fail++;
      await clearInFlight(store, row.id);
      log(`FAIL ${row.id} LLM required (add GEMINI_API_KEY or GROQ_API_KEY to .env.local): ${String(err.message || err).slice(0, 160)}`);
      continue;
    }

    answer = capitalizeSentencesInMarkdown(answer);
    const fin = validateEconomyAnswer(answer);
    if (!fin.ok) {
      fail++;
      await clearInFlight(store, row.id);
      log(`FAIL ${row.id} need>=1000w+mermaid ok words=${fin.words} mermaid=${fin.mermaidOk}`);
      continue;
    }

    log(`POLISH ${row.id} source=${source} words=${fin.words} Q=${blob.question.slice(0, 60)}…`);

    if (!opts.dryRun) {
      const ts = Date.now();
      const labRun = source && String(source).startsWith('llm-') ? 'economy-llm-polish-v1' : 'economy-polish-v1';
      await store.setJSON('answers/' + row.id + '.json', {
        ...blob,
        answer,
        lab_run: labRun,
        source,
        quality_polish_at: ts,
        last_modified_ms: ts,
        baseline_answer_v5: blob.baseline_answer_v5 || blob.answer,
      });
      const i = idx.entries.findIndex((x) => x?.id === row.id);
      if (i >= 0) idx.entries[i] = { ...idx.entries[i], last_modified_ms: ts };
      prog.done[row.id] = { ts, source };
      saveProgress(prog);
      if (done % 5 === 4) await store.setJSON('_index.json', idx);
    }

    await clearInFlight(store, row.id);
    done++;
    await new Promise((r) => setTimeout(r, 800));
  }

  if (!opts.dryRun) await store.setJSON('_index.json', idx);
  log(`DONE polished=${done} failed=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
