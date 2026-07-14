'use strict';
/**
 * For match-approved IDs (keeps + preapproved), set top internal = face URL.
 * Skips match rejects. Pillars: st, ik, ra, bs, gp.
 * Usage: node _apply_approved_tops_to_face.js
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
const ap = JSON.parse(fs.readFileSync(path.join(WD, '_match_approved_ids.json'), 'utf8'));
const ok = new Set(ap.ids || []);
const skip = new Set(ap.skipRejects || []);
const pillars = ['st', 'ik', 'ra', 'bs', 'gp'];
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
  if (/^##\s+Direct Answer\b/im.test(s)) {
    return s.replace(/^(##\s+Direct Answer[^\n]*\n+)/im, '$1\n![](' + url + ')\n\n');
  }
  return '![](' + url + ')\n\n' + s;
}

(async () => {
  const out = {};
  for (const pfx of pillars) {
    const rx = new RegExp('^' + pfx + '\\d+$', 'i');
    const ids = [...ok]
      .filter((id) => rx.test(id) && !skip.has(id))
      .sort(
        (a, b) =>
          (parseInt(String(a).replace(/\D/g, ''), 10) || 0) -
          (parseInt(String(b).replace(/\D/g, ''), 10) || 0)
      );
    let checked = 0,
      fixed = 0,
      already = 0,
      noFace = 0,
      noBlob = 0;
    const samples = [];
    for (const id of ids) {
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
        await store.setJSON(
          'answers/' + id + '.json',
          Object.assign({}, blob, {
            body: next,
            answer: blob.answer ? next : blob.answer,
            cover_src: 'face-top-same',
            face_title_baked: false,
          })
        );
      }
      fixed++;
      if (samples.length < 5) samples.push({ id, from: (top0 || '').slice(0, 60), to: face });
    }
    const rejectN = [...skip].filter((id) => rx.test(id)).length;
    out[pfx] = { checked, fixed, already, noFace, noBlob, rejectsSkipped: rejectN, samples, dry: DRY };
  }
  console.log(JSON.stringify({ ok: true, out }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
