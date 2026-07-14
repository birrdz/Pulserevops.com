'use strict';
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
const mosaic = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-st.json'), 'utf8'));
const ids = mosaic.map((x) => (typeof x === 'string' ? x : x.id)).filter(Boolean);

function sqOk(id) {
  try { return fs.statSync(path.join(QA, id + '.sq.jpg')).size > 8000; } catch (e) { return false; }
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const byId = new Map();
  for (const e of (idx.entries || [])) {
    if (e && e.id) byId.set(String(e.id).toLowerCase(), e);
  }
  let noQ = 0, shortQ = 0, okQ = 0, noSq = 0, hasSq = 0, baked = 0;
  const missQ = [];
  const missSq = [];
  for (const id of ids) {
    const e = byId.get(String(id).toLowerCase());
    const q = String((e && (e.question || e.title)) || '').trim();
    if (!q) { noQ++; if (missQ.length < 15) missQ.push(id); }
    else if (q.length < 12) { shortQ++; if (missQ.length < 15) missQ.push(id + ':short'); }
    else okQ++;
    if (e && e.face_title_baked) baked++;
    if (sqOk(id)) hasSq++;
    else { noSq++; if (missSq.length < 15) missSq.push(id); }
  }
  console.log(JSON.stringify({
    total: ids.length,
    titles: { ok: okQ, missing: noQ, short: shortQ, face_title_baked_flag: baked },
    browseSq: { has: hasSq, missing: noSq },
    missQSample: missQ,
    missSqSample: missSq,
    note: 'Prior Cursor title strat = HTML question on card + untitled .sq.jpg (NOT gold bake on face JPG)',
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
