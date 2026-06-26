#!/usr/bin/env node
/** Verify last-N-days economy/NIL entries meet 1,000w + mermaid gate. */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { loadEnvLocal } = require('./netlify/functions/lib/load-env-local');
const { validateEconomyAnswer, countWords, MIN_WORDS } = require('./netlify/functions/lib/economy-answer-quality');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const days = parseInt((process.argv.find((a) => a.startsWith('--days=')) || '').split('=')[1] || '2', 10);
const OUT = path.join(__dirname, '_economy_verify_backfill.json');

async function main() {
  loadEnvLocal(__dirname);
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE_ID,
    token: process.env.BLOBS_PAT,
  });
  const cutoff = Date.now() - days * 86400000;
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const cand = (idx.entries || []).filter((e) => {
    if (!e || !/^q\d+$/i.test(e.id) || (e.ts || 0) < cutoff) return false;
    const t = e.tags || [];
    return t.includes('economy-mode') || t.includes('revops-google') || t.includes('nil-gtm');
  });

  let ok = 0;
  const bad = [];
  for (const row of cand) {
    const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
    const v = validateEconomyAnswer(blob?.answer || '');
    if (v.ok) ok++;
    else bad.push({ id: row.id, words: v.words, mermaidOk: v.mermaidOk, lab_run: blob?.lab_run });
  }

  const nilOnly = cand.filter((e) => (e.tags || []).includes('nil-gtm'));
  let nilOk = 0;
  const nilBad = [];
  for (const row of nilOnly) {
    const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
    const v = validateEconomyAnswer(blob?.answer || '');
    if (v.ok) nilOk++;
    else nilBad.push({ id: row.id, words: v.words });
  }

  const report = {
    at: new Date().toISOString(),
    days,
    minWords: MIN_WORDS,
    total: cand.length,
    ok,
    bad: bad.length,
    badSample: bad.slice(0, 20),
    nilTotal: nilOnly.length,
    nilOk,
    nilBad: nilBad.length,
    nilBadSample: nilBad.slice(0, 10),
    pass: bad.length === 0,
  };
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
