'use strict';
/**
 * ST (+ optional BS) top internal = face URL when face exists on disk.
 * Owner: tops still old; face→top same URL is the locked pattern.
 * Usage: node _fix_pillar_tops_to_face.js st
 *        node _fix_pillar_tops_to_face.js st,bs
 */
const fs = require('fs');
const path = require('path');
const WD = __dirname;
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
const pillars = String(process.argv[2] || 'st').toLowerCase().split(/[,+]/).map((s) => s.trim()).filter(Boolean);
const DRY = process.env.DRY === '1';

function faceOk(id) {
  try {
    return fs.statSync(path.join(QA, id + '.jpg')).size > 8000;
  } catch (e) {
    return false;
  }
}
function firstMdImg(body) {
  const m = String(body || '').match(/!\[[^\]]*\]\(([^)]+)\)/);
  return m ? m[1] : null;
}
function setFirstMdImg(body, url) {
  const s = String(body || '');
  if (/!\[[^\]]*\]\([^)]+\)/.test(s)) {
    return s.replace(/!\[[^\]]*\]\([^)]+\)/, '![](' + url + ')');
  }
  // prepend after Direct Answer header if present, else top
  if (/^##\s+Direct Answer\b/im.test(s)) {
    return s.replace(/^(##\s+Direct Answer[^\n]*\n+)/im, '$1\n![](' + url + ')\n\n');
  }
  return '![](' + url + ')\n\n' + s;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const out = {};
  for (const pfx of pillars) {
    const rx = new RegExp('^' + pfx + '\\d+$', 'i');
    let checked = 0, fixed = 0, already = 0, noFace = 0, noBlob = 0;
    const samples = [];
    for (const e of idx.entries || []) {
      if (!e || !rx.test(String(e.id))) continue;
      const id = String(e.id);
      checked++;
      if (!faceOk(id)) {
        noFace++;
        continue;
      }
      const face = '/assets/qa/' + id + '.jpg';
      const blob = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!blob) {
        noBlob++;
        continue;
      }
      const body = blob.body || blob.answer || '';
      const top0 = firstMdImg(body);
      const same = top0 && (top0 === face || top0.startsWith(face + '?'));
      if (same) {
        already++;
        continue;
      }
      const next = setFirstMdImg(body, face);
      if (!DRY) {
        const updated = Object.assign({}, blob, {
          body: next,
          answer: blob.answer ? next : blob.answer,
          cover_src: 'face-top-same',
          face_title_baked: false,
        });
        await store.setJSON('answers/' + id + '.json', updated);
      }
      fixed++;
      if (samples.length < 8) samples.push({ id, from: (top0 || '').slice(0, 70), to: face });
    }
    out[pfx] = { checked, fixed, already, noFace, noBlob, samples, dry: DRY };
  }
  console.log(JSON.stringify({ ok: true, out }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
