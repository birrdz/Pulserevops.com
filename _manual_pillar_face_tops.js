'use strict';
// PILLAR X FACE/TOPS — HARD BLOCK on whole-pillar bulk (no shortcuts).
// Use: node _manual_pillar_face_tops_one.js <pillar> <id>
// Bulk override ONLY: node _manual_pillar_face_tops.js <pillar> 4444
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { assertNoShortcuts } = require('./_no_shortcuts_image_law');

const pillar = String(process.argv[2] || '').toLowerCase().replace(/[^a-z]/g, '');
const pass = String(process.argv[3] || '');
if (!pillar) {
  console.error('BLOCKED. Use one-id tool:');
  console.error('  node _manual_pillar_face_tops_one.js <pillar> <id>');
  console.error('Bulk only with owner passcode: node _manual_pillar_face_tops.js <pillar> 4444');
  process.exit(2);
}

// Without 4444 this throws — forces serial one-id path
try {
  assertNoShortcuts({ bulk: true, count: 999, passcode: pass });
} catch (e) {
  if (e && e.code === 'NO_SHORTCUTS_LAW') {
    console.error('⛔ Whole-pillar face/tops script is a SHORTCUT.');
    console.error('Do: node _manual_pillar_face_tops_one.js ' + pillar + ' <id>');
    console.error('Or pass 4444 as 3rd arg for owner bulk override.');
    process.exit(9);
  }
  throw e;
}

// --- owner 4444 bulk path only below ---
const { getStore } = require('@netlify/blobs');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const QA = path.join(WD, 'assets', 'qa');
const LOG = path.join(WD, '_' + pillar + '_face_tops_log.jsonl');
const PROG = path.join(WD, '_' + pillar + '_face_tops_progress.json');
const STATE_CANDIDATES = [
  path.join(WD, '_' + pillar + '_topic_review_state.json'),
  path.join(WD, '_ik_topic_review_state.json'),
  path.join(WD, '_gp_topic_review_state.json'),
];
const MOSAIC = path.join(WD, 'mosaic-pool-' + pillar + '.json');

function faceOk(id) {
  try { return fs.statSync(path.join(QA, id + '.jpg')).size > 8000; } catch (e) { return false; }
}
function loadApproved() {
  for (const f of STATE_CANDIDATES) {
    if (!fs.existsSync(f)) continue;
    try {
      const st = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (st.approved && typeof st.approved === 'object') return st.approved;
    } catch (e) {}
  }
  return null;
}

(async () => {
  console.log('[PILLAR X FACE/TOPS] BULK 4444 pillar=' + pillar);
  if (!fs.existsSync(MOSAIC)) {
    console.error('missing mosaic', MOSAIC);
    process.exit(3);
  }
  const mos = JSON.parse(fs.readFileSync(MOSAIC, 'utf8'));
  const approved = loadApproved();
  let wrote = 0, skip = 0, noFace = 0, noApprove = 0, errs = 0;
  for (const e of mos) {
    const id = e.id;
    const url = '/assets/qa/' + id + '.jpg';
    try {
      if (approved && !approved[id]) { noApprove++; continue; }
      if (!faceOk(id)) { noFace++; continue; }
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!cur) { skip++; continue; }
      const q = cur.question || e.question || id;
      let body = syncHeroDupesFaceCard(id, q, String(cur.answer || cur.body || ''));
      const ms = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
      for (const m of ms) {
        const u = m[2].replace(/\?.*$/, '');
        if (u === url || u.endsWith('/' + id + '.jpg')) continue;
        const alt = m[1] || q;
        const idx = body.indexOf(m[0]);
        if (idx >= 0) {
          body = body.slice(0, idx) + '![' + alt + '](' + url + ')' + body.slice(idx + m[0].length);
        }
        break;
      }
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
        answer: body,
        img: url,
        cover_src: cur.cover_src || 'pexels-topic',
        face_title_baked: false,
      }));
      fs.appendFileSync(LOG, JSON.stringify({ id, at: Date.now(), status: 'face+top-same', to: url, bypass4444: true }) + '\n');
      wrote++;
      if (wrote % 50 === 0) console.log('…', wrote, '/', mos.length, id);
    } catch (err) {
      errs++;
      console.log('ERR', id, String(err.message || err).slice(0, 80));
    }
  }
  const prog = {
    process: 'PILLAR X FACE/TOPS',
    pillar,
    at: new Date().toISOString(),
    total: mos.length,
    wrote,
    skip,
    noFace,
    noApprove,
    errs,
    bypass4444: true,
  };
  fs.writeFileSync(PROG, JSON.stringify(prog, null, 2));
  console.log(JSON.stringify(prog));
})().catch((e) => { console.error(e); process.exit(1); });
