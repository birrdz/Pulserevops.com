const fs = require('fs');
const { getStore } = require('@netlify/blobs');

const token = fs
  .readFileSync(`${__dirname}/.env.local`, 'utf8')
  .split(/\r?\n/)
  .find((l) => l.startsWith('BLOBS_PAT='))
  .slice('BLOBS_PAT='.length)
  .trim();
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token,
});

function tail(a) {
  return String(a).replace(/^## Direct Answer[\s\S]*?\n\n/, '').replace(/\s+/g, ' ').trim();
}

async function main() {
  const start = parseInt(process.argv[2] || '10444', 10);
  const end = parseInt(process.argv[3] || '10548', 10);
  const tails = new Map();
  for (let n = start; n <= end; n++) {
    const id = 'q' + n;
    const b = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!b?.answer) continue;
    const t = tail(b.answer);
    if (!tails.has(t)) tails.set(t, []);
    tails.get(t).push(id);
  }
  const sorted = [...tails.entries()].sort((a, b) => b[1].length - a[1].length);
  console.log(`q${start}–q${end}: ${sorted.length} unique bodies after stripping intro`);
  for (const [, ids] of sorted.slice(0, 3)) {
    console.log(`  ${ids.length} share template: ${ids.slice(0, 12).join(' ')}${ids.length > 12 ? ' ...' : ''}`);
  }
}

main();
