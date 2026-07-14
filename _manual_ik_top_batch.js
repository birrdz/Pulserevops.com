'use strict';
// Process next N IK top-internals (face-dupe). Manual driver — agent invokes per batch.
// Usage: node _manual_ik_top_batch.js [N=10]
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const QA = path.join(WD, 'assets', 'qa');
const LOG = path.join(WD, '_ik_manual_top_log.jsonl');
const PROG = path.join(WD, '_ik_manual_top_progress.json');
const N = Math.max(1, parseInt(process.argv[2] || '10', 10) || 10);

function doneSet() {
  const s = new Set();
  if (fs.existsSync(LOG)) {
    for (const line of fs.readFileSync(LOG, 'utf8').split(/\n/)) {
      if (!line.trim()) continue;
      try {
        const j = JSON.parse(line);
        if (j.id && (j.status === 'swapped' || j.status === 'already')) s.add(j.id);
      } catch (e) {}
    }
  }
  return s;
}

async function one(id) {
  const faceUrl = '/assets/qa/' + id + '.jpg';
  const facePath = path.join(QA, id + '.jpg');
  if (!fs.existsSync(facePath) || fs.statSync(facePath).size < 8000) {
    return { id, status: 'no_face' };
  }
  const cur = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!cur) return { id, status: 'no_blob' };
  let body = String(cur.answer || cur.body || '');
  const matches = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  if (!matches.length) return { id, status: 'no_imgs' };
  let target = null;
  for (const m of matches) {
    const url = m[2].replace(/\?.*$/, '');
    if (url === faceUrl || url.endsWith('/' + id + '.jpg')) continue;
    target = m;
    break;
  }
  if (!target) return { id, status: 'no_top_slot' };
  const oldUrl = target[2];
  if (oldUrl.replace(/\?.*$/, '') === faceUrl) {
    const row = { id, at: Date.now(), status: 'already', to: faceUrl };
    fs.appendFileSync(LOG, JSON.stringify(row) + '\n');
    return row;
  }
  const alt = target[1] || (cur.question || id);
  const newMd = '![' + alt + '](' + faceUrl + ')';
  const idx = body.indexOf(target[0]);
  if (idx < 0) return { id, status: 'index_fail' };
  body = body.slice(0, idx) + newMd + body.slice(idx + target[0].length);
  await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { answer: body }));
  const row = {
    id, at: Date.now(), status: 'swapped',
    from: oldUrl.slice(0, 90), to: faceUrl,
    faceBytes: fs.statSync(facePath).size,
  };
  fs.appendFileSync(LOG, JSON.stringify(row) + '\n');
  return row;
}

(async () => {
  const mos = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-ik.json'), 'utf8'));
  const done = doneSet();
  const queue = mos.map((e) => e.id).filter((id) => !done.has(id));
  const batch = queue.slice(0, N);
  const results = [];
  for (const id of batch) {
    const r = await one(id);
    results.push(r);
    process.stdout.write(r.id + ' ' + r.status + '\n');
  }
  const done2 = doneSet();
  const prog = {
    at: new Date().toISOString(),
    total: mos.length,
    done: done2.size,
    left: mos.length - done2.size,
    batch: batch.length,
    spotLookId: batch[batch.length - 1] || null,
  };
  fs.writeFileSync(PROG, JSON.stringify(prog, null, 2));
  console.log('PROGRESS', JSON.stringify(prog));
})().catch((e) => { console.error(e); process.exit(1); });
