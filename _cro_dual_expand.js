// _cro_dual_expand.js — dual-title variants for the CRO (tl) pillar: every CRO question
// should exist in BOTH "CRO" and "Chief Revenue Officer" wording (owner: "1 title can be
// 2 titles") for search coverage. Reads the PENDING _cro_ds_queue.json (future writes only
// — does NOT touch published entries), and for each item makes the MISSING twin by swapping
// the term. Dedups EXACT pillar+question vs index + queue (these twins are near-variants,
// not word-for-word dupes, so allowed). Appends new ids. DRY by default; --live to write.
// All CRO titles already end "in 2027" so the twin inherits it. See feedback_cro_dual_title_variants.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const LIVE = process.argv.includes('--live');
const QUEUE = 'C:/Users/koryj/website/_cro_ds_queue.json';
const norm = s => String(s || '').trim().replace(/\s+/g, ' ');
const key = t => 'tl ' + norm(t).toLowerCase();

// swap the term. Returns the twin title, or null if neither term present.
function twin(title) {
  const hasFull = /Chief Revenue Officer/i.test(title);
  const hasAcro = /\bCROs?\b/.test(title);
  if (hasFull) {
    // Chief Revenue Officer -> CRO (preserve a trailing plural s -> CROs)
    return title.replace(/Chief Revenue Officers/gi, 'CROs').replace(/Chief Revenue Officer/gi, 'CRO');
  }
  if (hasAcro) {
    // CRO -> Chief Revenue Officer (CROs -> Chief Revenue Officers)
    return title.replace(/\bCROs\b/g, 'Chief Revenue Officers').replace(/\bCRO\b/g, 'Chief Revenue Officer');
  }
  return null;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const existing = new Set();
  let maxTl = 0;
  for (const e of (idx.entries || [])) {
    const m = String(e.id).match(/^tl(\d+)$/i);
    if (m) maxTl = Math.max(maxTl, +m[1]);
    if (/^tl\d+$/i.test(e.id) && e.question) existing.add(key(e.question));
  }
  const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
  const inQueue = new Set(queue.map(it => key(it.title)));
  for (const m of queue) { const mm = String(m.id).match(/^tl(\d+)$/i); if (mm) maxTl = Math.max(maxTl, +mm[1]); }

  const additions = [];
  const claimed = new Set();
  for (const it of queue) {
    const tw = twin(it.title);
    if (!tw || norm(tw) === norm(it.title)) continue;
    const k = key(tw);
    if (existing.has(k) || inQueue.has(k) || claimed.has(k)) continue; // twin already covered
    claimed.add(k);
    additions.push({ title: norm(tw), kind: it.kind || 'cro', prefix: 'tl', dualOf: it.id });
  }
  const withIds = additions.map((a, i) => ({ id: 'tl' + String(maxTl + 1 + i), ...a }));
  console.log(`pending queue: ${queue.length} | new twins to add: ${withIds.length}`);
  console.log('samples:'); withIds.slice(0, 5).forEach(a => console.log('  + ' + a.id + '  ' + a.title));
  if (!LIVE) { console.log('\nDRY RUN — re-run with --live to append these twins to the queue.'); return; }
  const out = queue.concat(withIds);
  fs.writeFileSync(QUEUE, JSON.stringify(out, null, 1));
  console.log(`\nLIVE: appended ${withIds.length} twins -> queue now ${out.length} items (ids up to tl${maxTl + withIds.length}).`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
