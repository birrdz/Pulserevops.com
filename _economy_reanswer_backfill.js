#!/usr/bin/env node
/**
 * Re-write economy Q&As that used the old canned template.
 * Default: entries from the last 2 days with economy-mode / nil-gtm / revops-google tags.
 *
 * Usage:
 *   node _economy_reanswer_backfill.js              # last 2 days, canned only
 *   node _economy_reanswer_backfill.js --days=3
 *   node _economy_reanswer_backfill.js --all-canned   # any date, if answer matches canned marker
 *   node _economy_reanswer_backfill.js --dry-run
 *
 * Requires BLOBS_PAT in .env.local
 */

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { generateAnswer } = require('./netlify/functions/lib/economy-answer-generate');
const { needsIntelligentRewrite } = require('./netlify/functions/lib/economy-answer-build');
const { validateEconomyAnswer } = require('./netlify/functions/lib/economy-answer-quality');
const { capitalizeSentencesInMarkdown } = require('./netlify/functions/lib/text-capitalize');
const { loadEnvLocal } = require('./netlify/functions/lib/load-env-local');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = path.join(__dirname, '_economy_reanswer_backfill.log');

function loadPat() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local missing');
  const env = fs.readFileSync(envPath, 'utf8');
  const m = env.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing in .env.local');
  return m[1].trim();
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

function parseArgs() {
  const daysArg = process.argv.find((a) => a.startsWith('--days='));
  return {
    days: daysArg ? parseInt(daysArg.split('=')[1], 10) : 2,
    allCanned: process.argv.includes('--all-canned'),
    dryRun: process.argv.includes('--dry-run'),
    limit: (() => {
      const a = process.argv.find((x) => x.startsWith('--limit='));
      return a ? parseInt(a.split('=')[1], 10) : 0;
    })(),
  };
}

function isEconomyEntry(e) {
  const tags = e.tags || [];
  return (
    tags.includes('economy-mode') ||
    tags.includes('revops-google') ||
    tags.includes('nil-gtm')
  );
}

function wordCount(s) {
  return String(s || '').split(/\s+/).filter(Boolean).length;
}

async function main() {
  const opts = parseArgs();
  loadEnvLocal(__dirname);
  const cutoff = Date.now() - opts.days * 24 * 60 * 60 * 1000;
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE_ID,
    token: loadPat(),
  });

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  let candidates = (idx.entries || []).filter((e) => e && /^q\d+$/i.test(e.id) && isEconomyEntry(e));
  candidates.sort((a, b) => parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10));

  if (!opts.allCanned) {
    candidates = candidates.filter((e) => (e.ts || 0) >= cutoff);
  }

  log(`START days=${opts.days} allCanned=${opts.allCanned} dryRun=${opts.dryRun} candidates=${candidates.length} (newest first)`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of candidates) {
    if (opts.limit && updated + skipped + failed >= opts.limit) break;

    const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!blob || !blob.question || !blob.answer) {
      skipped++;
      continue;
    }

    if (!opts.allCanned && !needsIntelligentRewrite(blob)) {
      skipped++;
      log(`SKIP ${row.id} (already LLM-specific)`);
      continue;
    }

    let newAnswer;
    let source;
    try {
      ({ answer: newAnswer, source } = await generateAnswer(blob.question, { preferLlm: true, llmRequired: true }));
    } catch (err) {
      failed++;
      log(`FAIL ${row.id} LLM required: ${String(err.message || err).slice(0, 120)}`);
      continue;
    }
    newAnswer = capitalizeSentencesInMarkdown(newAnswer);
    const fin = validateEconomyAnswer(newAnswer);
    if (!fin.ok) {
      failed++;
      log(`FAIL ${row.id} words=${fin.words} mermaid=${fin.mermaidOk}`);
      continue;
    }
    if (newAnswer === blob.answer) {
      skipped++;
      log(`SKIP ${row.id} (unchanged)`);
      continue;
    }
    if (!/```mermaid/.test(newAnswer) && /```mermaid/.test(blob.answer)) {
      // preserve mermaid if builder omitted fence (builder always includes mermaid)
    }
    if (newAnswer.length < 800) {
      failed++;
      log(`FAIL ${row.id} answer too short (${newAnswer.length} chars)`);
      continue;
    }

    const wc = wordCount(newAnswer);
    log(`${opts.dryRun ? 'DRY' : 'OK'} ${row.id} wc=${wc} Q=${blob.question.slice(0, 72)}…`);

    if (!opts.dryRun) {
      const ts = Date.now();
      await store.setJSON('answers/' + row.id + '.json', {
        ...blob,
        answer: newAnswer,
        last_modified_ms: ts,
        lab_run: source && String(source).startsWith('llm-') ? 'economy-llm-reanswer-v1' : 'economy-reanswer-v2',
        source,
        reanswer_at: ts,
        baseline_answer_v5: blob.baseline_answer_v5 || blob.answer,
      });
      const i = (idx.entries || []).findIndex((x) => x && x.id === row.id);
      if (i >= 0) {
        idx.entries[i] = { ...idx.entries[i], last_modified_ms: ts };
      }
      updated++;
      await new Promise((r) => setTimeout(r, 120));
    } else {
      updated++;
    }
  }

  if (!opts.dryRun && updated > 0) {
    await store.setJSON('_index.json', idx);
  }

  log(`DONE updated=${updated} skipped=${skipped} failed=${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
