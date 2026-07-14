// _facecard_fill_approved.js — fill EVERY Q&A face-card cover from the OWNER-APPROVED pool images
// (the ~1,846 you ✓'d in the gallery — _gp_pool_approval.json → assets/qa/_gp_pool/<slot>.jpg).
// No generation. Each entry gets an approved image, clean-graded, saved to /assets/qa/<id>.jpg, spread so
// it is NOT one-image-per-pillar. Resume-safe (_facecard_fill_done.json). Ordered revenue-pillars first.
//   Usage: node _facecard_fill_approved.js [pillarPrefix]   (default: all, revenue pillars first)
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const flib = require('./_ddg_facecard_lib');
const POOL = WD + '/assets/qa/_gp_pool';
const DONE_F = WD + '/_facecard_fill_done.json';
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();

// approved slots -> existing files
const approval = JSON.parse(fs.readFileSync(WD + '/_gp_pool_approval.json', 'utf8'));
const okVals = new Set([true, 1, 'ok', 'approve', 'approved', 'yes']);
let approvedFiles = Object.keys(approval).filter(k => okVals.has(approval[k]))
  .map(slot => POOL + '/' + String(slot).padStart(3, '0') + '.jpg')
  .filter(f => { try { return fs.statSync(f).size > 3000; } catch (e) { return false; } });
console.log('[fill] approved images available: ' + approvedFiles.length);
if (!approvedFiles.length) { console.error('HALT: no approved pool images found.'); process.exit(2); }

async function main() {
  const only = (process.argv[2] || '').toLowerCase();
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let entries = (idx.entries || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
  if (only) entries = entries.filter(e => String(e.id).toLowerCase().startsWith(only));
  // revenue pillars first, then the rest
  const FRONT = ['gp', 'ra', 'ik', 'tk', 'st', 'gb'];
  entries.sort((a, b) => (FRONT.indexOf(pOf(a.id)) + 1 || 99) - (FRONT.indexOf(pOf(b.id)) + 1 || 99));
  const done = (() => { try { return new Set(JSON.parse(fs.readFileSync(DONE_F, 'utf8'))); } catch (e) { return new Set(); } })();
  console.log('[fill] entries=' + entries.length + '  alreadyDone=' + done.size);
  let n = 0, fail = 0, ai = 0;
  const idxDirty = [];
  for (const e of entries) {
    const id = String(e.id);
    if (done.has(id)) continue;
    // pick an approved image, round-robin so adjacent same-pillar entries differ
    const file = approvedFiles[ai % approvedFiles.length]; ai++;
    try {
      const buf = fs.readFileSync(file);
      await flib.gradeFaceCardFromBuffer(buf, flib.coverPath(id), { question: e.question || e.title || id });
      // stamp provenance on the answers blob + mark index img
      try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cover_src: 'approved-pool', face_title_baked: false })); } catch (z) {}
      e.img = '/assets/qa/' + id + '.jpg'; e.cover_src = 'approved-pool'; idxDirty.push(id);
      done.add(id); n++;
      if (n % 25 === 0) { fs.writeFileSync(DONE_F, JSON.stringify([...done])); try { await store.setJSON('_index.json', idx); } catch (z) {} process.stdout.write('\r[fill] ' + n + '/' + entries.length + ' (' + id + ')'); }
    } catch (x) { fail++; }
  }
  fs.writeFileSync(DONE_F, JSON.stringify([...done]));
  try { await store.setJSON('_index.json', idx); } catch (z) {}
  console.log('\n[fill] DONE  covered=' + n + '  failed=' + fail + '  (approved images cycled ' + Math.ceil(n / approvedFiles.length) + 'x)');
}
main().catch(e => { console.error('[fill] FATAL', e.message); process.exit(1); });
