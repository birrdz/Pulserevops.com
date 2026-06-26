// Find economy Q&As with identical answer bodies (sample or range).
// Usage: node _check_economy_dup_answers.js [startNum] [endNum]
const https = require('https');
const { getStore } = require('@netlify/blobs');
const fs = require('fs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const START = parseInt(process.argv[2] || '10444', 10);
const END = parseInt(process.argv[3] || '10548', 10);

function loadToken() {
  const line = fs
    .readFileSync(`${__dirname}/.env.local`, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('BLOBS_PAT='));
  if (!line) throw new Error('BLOBS_PAT missing');
  return line.slice('BLOBS_PAT='.length).trim();
}

function normAnswer(a, full) {
  const s = String(a || '').replace(/\s+/g, ' ').trim();
  return full ? s : s.slice(0, 500);
}

async function main() {
  const token = loadToken();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });
  const byHash = new Map();
  const missing = [];

  for (let n = START; n <= END; n++) {
    const id = 'q' + n;
    const blob = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!blob) {
      missing.push(id);
      continue;
    }
    if (blob.lab_run !== 'economy-mode' && !String(blob.lab_run || '').includes('economy')) {
      continue;
    }
    const h = normAnswer(blob.answer, true);
    if (!byHash.has(h)) byHash.set(h, []);
    byHash.get(h).push({ id, q: (blob.question || '').slice(0, 70) });
  }

  const clusters = [...byHash.entries()].sort((a, b) => b[1].length - a[1].length);
  console.log(`Range q${START}–q${END}: ${clusters.length} unique answer fingerprints`);
  console.log(`Missing blobs: ${missing.length}`);
  for (const [hash, items] of clusters.slice(0, 5)) {
    console.log(`\n${items.length} entries share same answer body:`);
    items.slice(0, 8).forEach((x) => console.log(`  ${x.id}  ${x.q}`));
    if (items.length > 8) console.log(`  ... +${items.length - 8} more`);
  }
  const dupCount = clusters.filter(([, items]) => items.length > 1).reduce((s, [, items]) => s + items.length, 0);
  console.log(`\nTotal in duplicate clusters: ${dupCount}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
