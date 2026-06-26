#!/usr/bin/env node
/** Rewrite last-N-days economy Q&As that are under MIN_WORDS. */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { loadEnvLocal } = require('./netlify/functions/lib/load-env-local');
const { buildAnswer } = require('./netlify/functions/lib/economy-answer-build');
const { generateAnswer } = require('./netlify/functions/lib/economy-answer-generate');
const { capitalizeSentencesInMarkdown } = require('./netlify/functions/lib/text-capitalize');
const {
  finalizeEconomyAnswer,
  countWords,
  validateEconomyAnswer,
  MIN_WORDS,
} = require('./netlify/functions/lib/economy-answer-quality');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const LOG = path.join(__dirname, '_economy_fix_all_short.log');
const days = parseInt((process.argv.find((a) => a.startsWith('--days=')) || '').split('=')[1] || '2', 10);

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

async function main() {
  loadEnvLocal(__dirname);
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE_ID,
    token: process.env.BLOBS_PAT,
  });
  const cutoff = Date.now() - days * 86400000;
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const cand = (idx.entries || [])
    .filter((e) => {
      if (!e || !/^q\d+$/i.test(e.id) || (e.ts || 0) < cutoff) return false;
      const t = e.tags || [];
      return t.includes('economy-mode') || t.includes('revops-google') || t.includes('nil-gtm');
    })
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));

  let fixed = 0;
  let skip = 0;
  let fail = 0;

  log(`START days=${days} candidates=${cand.length}`);

  for (const row of cand) {
    const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!blob?.question) {
      skip++;
      continue;
    }
    const before = countWords(blob.answer);
    if (validateEconomyAnswer(blob.answer).ok) {
      skip++;
      continue;
    }
    let fin;
    try {
      const gen = await generateAnswer(blob.question, { preferLlm: true, llmRequired: true });
      fin = finalizeEconomyAnswer(gen.answer, blob.question);
    } catch (_) {
      fin = finalizeEconomyAnswer(buildAnswer(blob.question), blob.question);
    }
    if (!fin.ok) {
      fail++;
      log(`FAIL ${row.id} words=${fin.words} mermaid=${fin.mermaidOk}`);
      continue;
    }
    const answer = capitalizeSentencesInMarkdown(fin.answer);
    const ts = Date.now();
    await store.setJSON('answers/' + row.id + '.json', {
      ...blob,
      answer,
      lab_run: 'economy-short-fix-v3',
      quality_polish_at: ts,
      last_modified_ms: ts,
    });
    const i = idx.entries.findIndex((x) => x?.id === row.id);
    if (i >= 0) idx.entries[i] = { ...idx.entries[i], last_modified_ms: ts };
    fixed++;
    if (fixed % 25 === 0) {
      await store.setJSON('_index.json', idx);
      log(`progress fixed=${fixed} skip=${skip} fail=${fail}`);
    }
  }

  await store.setJSON('_index.json', idx);
  log(`DONE fixed=${fixed} skip=${skip} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
