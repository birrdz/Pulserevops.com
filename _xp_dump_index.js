// Dump _index.json grouped by pillar prefix → scratchpad files (id + question only).
// Read-only. Used to plan cross-pillar copies.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const OUT = process.argv[2] || 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/6ead528c-c395-40d0-85bd-8c3ab0cc23ee/scratchpad';

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const groups = {};
  const maxNum = {};
  for (const e of idx.entries) {
    if (!e || !e.id) continue;
    const m = e.id.match(/^([a-z]+)(\d+)$/i);
    if (!m) continue;
    const pfx = m[1].toLowerCase();
    const num = parseInt(m[2], 10);
    (groups[pfx] = groups[pfx] || []).push({ id: e.id, num, q: e.question || '' });
    if (!maxNum[pfx] || num > maxNum[pfx]) maxNum[pfx] = num;
  }
  fs.mkdirSync(OUT, { recursive: true });
  const summary = {};
  for (const pfx of Object.keys(groups)) {
    groups[pfx].sort((a, b) => a.num - b.num);
    fs.writeFileSync(OUT + '/pillar_' + pfx + '.json', JSON.stringify(groups[pfx], null, 0));
    summary[pfx] = { count: groups[pfx].length, max: maxNum[pfx], next: maxNum[pfx] + 1 };
  }
  fs.writeFileSync(OUT + '/_pillar_summary.json', JSON.stringify(summary, null, 2));
  console.log('total index entries:', idx.entries.length);
  console.log(JSON.stringify(summary, null, 2));
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
