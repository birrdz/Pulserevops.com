// _writer_seed.js — seed the front-writer queue. Assigns next-available ids for a pillar prefix,
// dedups vs the live index (same question + same pillar = skip), appends to _writer_queue.json.
//   node _writer_seed.js <prefix> "Title one" "Title two" ...
//   node _writer_seed.js <prefix> --file titles.txt        (one title per line)
//   node _writer_seed.js <prefix> --kind top10 "Title"     (optional: kind/ruleset for all)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const QUEUE = WD + '/_writer_queue.json';

(async () => {
  const argv = process.argv.slice(2);
  const prefix = (argv.shift() || '').toLowerCase();
  if (!prefix || !/^[a-z]+$/.test(prefix)) { console.error('usage: node _writer_seed.js <prefix> "Title" ... | --file titles.txt'); process.exit(1); }
  let kind, ruleset, titles = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--kind') { kind = argv[++i]; }
    else if (argv[i] === '--ruleset') { ruleset = argv[++i]; }
    else if (argv[i] === '--file') { titles.push(...fs.readFileSync(argv[++i], 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean)); }
    else titles.push(argv[i]);
  }
  if (!titles.length) { console.error('no titles given'); process.exit(1); }

  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const sameP = (idx.entries || []).filter(e => e && e.id && new RegExp('^' + prefix + '\\d').test(e.id));
  const existingQ = new Set(sameP.map(e => String(e.question || '').trim().toLowerCase()));
  let maxN = 0, width = 4;
  for (const e of sameP) { const m = e.id.match(new RegExp('^' + prefix + '(\\d+)$')); if (m) { maxN = Math.max(maxN, parseInt(m[1], 10)); width = Math.max(width, m[1].length); } }
  const q = (() => { try { return JSON.parse(fs.readFileSync(QUEUE, 'utf8')); } catch (e) { return []; } });
  const queue = q();
  const queuedTitles = new Set(queue.map(it => String(it.title || '').trim().toLowerCase()));

  let added = 0, skipped = 0;
  for (const title of titles) {
    const k = title.trim().toLowerCase();
    if (existingQ.has(k) || queuedTitles.has(k)) { skipped++; continue; }
    maxN++;
    const id = prefix + String(maxN).padStart(width, '0');
    queue.push(Object.assign({ id, title: title.trim() }, kind ? { kind } : {}, ruleset ? { ruleset } : {}));
    queuedTitles.add(k); added++;
  }
  fs.writeFileSync(QUEUE, JSON.stringify(queue, null, 0));
  console.log(`seeded ${added} new ${prefix} titles (skipped ${skipped} dup), next id ${prefix + String(maxN).padStart(width, '0')}; queue now ${queue.length}. Launch: node _writer_front.js`);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
