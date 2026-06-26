#!/usr/bin/env node
/** Fix one economy Q&A: 1000+ words + valid mermaid. Usage: node _economy_fix_one.js q11015 */
const { getStore } = require('@netlify/blobs');
const { loadEnvLocal } = require('./netlify/functions/lib/load-env-local');
const { generateAnswer } = require('./netlify/functions/lib/economy-answer-generate');
const { capitalizeSentencesInMarkdown } = require('./netlify/functions/lib/text-capitalize');
const { countWords, validateEconomyAnswer } = require('./netlify/functions/lib/economy-answer-quality');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

async function main() {
  const id = (process.argv[2] || '').toLowerCase();
  if (!/^q\d+$/.test(id)) {
    console.error('Usage: node _economy_fix_one.js q11015');
    process.exit(1);
  }
  loadEnvLocal(__dirname);
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  const blob = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!blob?.question) throw new Error('missing blob');

  let answer;
  let source;
  ({ answer, source } = await generateAnswer(blob.question, { preferLlm: true, llmRequired: true }));
  answer = capitalizeSentencesInMarkdown(answer);
  const v = validateEconomyAnswer(answer);
  if (!v.ok) {
    console.error('Invalid:', v);
    process.exit(1);
  }

  const ts = Date.now();
  await store.setJSON('answers/' + id + '.json', {
    ...blob,
    answer,
    lab_run: source,
    quality_polish_at: ts,
    last_modified_ms: ts,
  });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const i = (idx.entries || []).findIndex((e) => e?.id === id);
  if (i >= 0) {
    idx.entries[i] = { ...idx.entries[i], last_modified_ms: ts };
    await store.setJSON('_index.json', idx);
  }
  console.log('OK', id, 'words=', countWords(answer), 'source=', source);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
