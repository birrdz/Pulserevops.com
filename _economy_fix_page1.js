#!/usr/bin/env node
/** Force 1000+ word programmatic answers for top N library entries (page 1 = 30). */
const { getStore } = require('@netlify/blobs');
const { loadEnvLocal } = require('./netlify/functions/lib/load-env-local');
const { buildAnswer } = require('./netlify/functions/lib/economy-answer-build');
const { capitalizeSentencesInMarkdown } = require('./netlify/functions/lib/text-capitalize');
const {
  finalizeEconomyAnswer,
  countWords,
  validateEconomyAnswer,
  MIN_WORDS,
} = require('./netlify/functions/lib/economy-answer-quality');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const N = parseInt((process.argv.find((a) => a.startsWith('--n=')) || '').split('=')[1] || '30', 10);

async function main() {
  loadEnvLocal(__dirname);
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE_ID,
    token: process.env.BLOBS_PAT,
  });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const top = (idx.entries || [])
    .filter((e) => e && /^q\d+$/i.test(e.id))
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, N);

  let ok = 0;
  let skip = 0;
  for (const row of top) {
    const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!blob?.question) {
      skip++;
      continue;
    }
    const wcBefore = countWords(blob.answer);
    if (wcBefore >= MIN_WORDS && validateEconomyAnswer(blob.answer).ok) {
      console.log('SKIP', row.id, 'already', wcBefore, 'w');
      skip++;
      continue;
    }
    const fin = finalizeEconomyAnswer(buildAnswer(blob.question), blob.question);
    if (!fin.ok) {
      console.error('FAIL build', row.id, 'words', fin.words, 'mermaid', fin.mermaidOk);
      continue;
    }
    const answer = capitalizeSentencesInMarkdown(fin.answer);
    const ts = Date.now();
    await store.setJSON('answers/' + row.id + '.json', {
      ...blob,
      answer,
      lab_run: 'economy-page1-v3',
      quality_polish_at: ts,
      last_modified_ms: ts,
    });
    const i = idx.entries.findIndex((x) => x?.id === row.id);
    if (i >= 0) idx.entries[i] = { ...idx.entries[i], last_modified_ms: ts };
    console.log('OK', row.id, wcBefore, '->', fin.words);
    ok++;
  }
  await store.setJSON('_index.json', idx);
  console.log(`DONE fixed=${ok} skipped=${skip} top=${N}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
